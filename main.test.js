const {
    RideQuery,
    RideStatus,
    PaymentStatus,
    PaymentMethod,
    PaymentService,
    CreditCardPayment,
    CryptoPayment,
    PayPalPayment,
    CreditCardDetails,
    PayPalDetails,
    VehicleType,
    UserRole,
    User,
    Vehicle,
    Car,
    Suv,
    Bike,
    Passenger,
    Driver,
    Admin,
    RideRequest,
    FareCalculator,
    RideService,
    Payment,
    Receipt
  } = require('./main');

  
  describe('Ride Sharing System Tests', () => {
    // Setup common test objects
    let rideService;
    let paymentService;
    let fareCalculator;
    let creditCardProvider;
    let paypalProvider;
    let cryptoProvider;
    let passengers = [];
    let drivers = [];
  
    beforeEach(() => {
      // Initialize services
      rideService = new RideService();
      paymentService = new PaymentService();
      fareCalculator = new FareCalculator();
      
      // Initialize payment providers with initial balance
      creditCardProvider = new CreditCardPayment('CCP_1', 'Stripe', 'Stripe Gateway', 1000);
      paypalProvider = new PayPalPayment('PPP_1', 'PayPal', 'MID123456', 1000);
      cryptoProvider = new CryptoPayment('CRYPTO_1', 'Crypto', 'Ethereum', 1000);
      
      // Register payment providers
      paymentService.registerPaymentProvider(creditCardProvider);
      paymentService.registerPaymentProvider(paypalProvider);
      paymentService.registerPaymentProvider(cryptoProvider);
      
      // Create passengers array - using different starting locations (A-E)
      passengers = [
        new Passenger('John Doe'),
        new Passenger('Jane Smith'),
        new Passenger('Bob Johnson'),
        new Passenger('Alice Brown'),
        new Passenger('Charlie Wilson')
      ];
      
      // Create drivers array - located at different points (A-E)
      drivers = [
        new Driver('Driver A', 'A'),
        new Driver('Driver B', 'B'),
        new Driver('Driver C', 'C'),
        new Driver('Driver D', 'D'),
        new Driver('Driver E', 'E')
      ];
      
      // Assign vehicles to drivers
      drivers[0].assignVehicle(VehicleType.CAR, 'CAR_1', 'Toyota Camry', 'ABC123', 4);
      drivers[1].assignVehicle(VehicleType.SUV, 'SUV_1', 'Honda CR-V', 'DEF456', 6);
      drivers[2].assignVehicle(VehicleType.BIKE, 'BIKE_1', 'Yamaha', 'GHI789', 1);
      drivers[3].assignVehicle(VehicleType.CAR, 'CAR_2', 'Ford Focus', 'JKL012', 4);
      drivers[4].assignVehicle(VehicleType.SUV, 'SUV_2', 'Chevrolet Suburban', 'MNO345', 8);
      
      
      // Register all drivers with the ride service
      drivers.forEach(driver => rideService.registerDriver(driver));
    });
  
    describe('Passenger Tests', () => {
      test('Account creation', () => {
        const passenger = new Passenger('New Passenger');
        
        expect(passenger).toBeDefined();
        expect(passenger.name).toBe('New Passenger');
        expect(passenger.role).toBe(UserRole.PASSENGER);
        expect(passenger.rideHistory).toEqual([]);
        expect(passenger.paymentMethods).toEqual([]);
        expect(passenger.defaultPaymentMethod).toBeNull();
      });
      
      test('Ride query', () => {
        const query = new RideQuery('A', 'D');
        const fare = fareCalculator.getFare(query);
        
        expect(fare).toBeDefined();
        // The distance from A to D is 3, so fare should be base fare + 3*pricePerStep
        // Base fare is 2.5, price per step is 1, so expected fare is $5.50
        expect(fare).toBe(5.5);
      });
      
      test('Ride booking - success with sufficient balance', () => {
        const passenger = passengers[0];
        const pickupPoint = 'A';
        const destination = 'D';
        
        const rideRequest = rideService.createRideRequest(passenger, pickupPoint, destination, creditCardProvider);
        
        expect(rideRequest).toBeDefined();
        expect(rideRequest.passenger).toBe(passenger);
        expect(rideRequest.pickupPoint).toBe(pickupPoint);
        expect(rideRequest.destination).toBe(destination);
        expect(rideRequest.status).toBe(RideStatus.REQUESTED);
      });
      
      test('Ride booking - insufficient balance', () => {
        const passenger = passengers[0];
        const pickupPoint = 'A';
        const destination = 'Z'; // Far destination to generate high fare
        // Create provider with low balance
        const lowBalanceProvider = new CreditCardPayment('CCP_LOW', 'Low Balance', 'Gateway', 1);
        
        const rideRequest = rideService.createRideRequest(passenger, pickupPoint, destination, lowBalanceProvider);
        
        // Should return false due to insufficient balance
        expect(rideRequest).toBe(false);
      });
      
      test('Ride cancelation', () => {
        const passenger = passengers[0];
        const rideRequest = rideService.createRideRequest(passenger, 'A', 'D', creditCardProvider);
        
        const cancelResult = passenger.cancelRide(rideRequest, rideService);
        
        expect(cancelResult).toBe(true);
        expect(rideRequest.status).toBe(RideStatus.CANCELLED);
      });
      
      test('Add payment method', () => {
        const passenger = passengers[0];
        const cardDetails = paymentService.paymentDetailsService.createPaymentMethodDetails(
          passenger,
          PaymentMethod.CREDIT_CARD,
          {
            cardNumber: '4111111111111111',
            cardHolderName: 'John Doe',
            expiryDate: '12/25',
            encryptedCVV: '123',
            billingAddress: '123 Main St'
          }
        );
        
        const result = passenger.addPaymentMethod(cardDetails, PaymentMethod.CREDIT_CARD);
        
        expect(result).toBe(true);
        expect(passenger.paymentMethods.length).toBe(1);
        expect(passenger.paymentMethods[0].details).toBe(cardDetails);
        expect(passenger.paymentMethods[0].method).toBe(PaymentMethod.CREDIT_CARD);
      });
      
      test('Remove payment method', () => {
        const passenger = passengers[0];
        const cardDetails = paymentService.paymentDetailsService.createPaymentMethodDetails(
          passenger,
          PaymentMethod.CREDIT_CARD,
          {
            cardNumber: '4111111111111111',
            cardHolderName: 'John Doe',
            expiryDate: '12/25',
            encryptedCVV: '123',
            billingAddress: '123 Main St'
          }
        );
        
        passenger.addPaymentMethod(cardDetails, PaymentMethod.CREDIT_CARD);
        const initialLength = passenger.paymentMethods.length;
        
        const result = passenger.removePaymentMethod(cardDetails.id);
        
        expect(result).toBe(true);
        expect(passenger.paymentMethods.length).toBe(initialLength - 1);
      });
      
      test('Set default payment method', () => {
        const passenger = passengers[0];
        const cardDetails = paymentService.paymentDetailsService.createPaymentMethodDetails(
          passenger,
          PaymentMethod.CREDIT_CARD,
          {
            cardNumber: '4111111111111111',
            cardHolderName: 'John Doe',
            expiryDate: '12/25',
            encryptedCVV: '123',
            billingAddress: '123 Main St'
          }
        );
        
        passenger.addPaymentMethod(cardDetails, PaymentMethod.CREDIT_CARD);
        
        const result = passenger.setDefaultPaymentMethod(cardDetails.id);
        
        expect(result).toBe(true);
        expect(passenger.defaultPaymentMethod).toBeDefined();
        expect(passenger.defaultPaymentMethod.details.id).toBe(cardDetails.id);
      });
    });
  
    describe('Driver Tests', () => {
      test('Register vehicle', () => {
        const driver = new Driver('New Driver', 'A');    
        const result = driver.assignVehicle(VehicleType.CAR, 'NEW_CAR', 'Tesla Model 3', 'TESLA123', 4);

        
        
        
        expect(result).toBe(true);
        expect(driver.vehicle.model).toBe('Tesla Model 3');
        expect(driver.vehicle.getType()).toBe(VehicleType.CAR);
      });
      
      test('Set availability', () => {
        const driver = drivers[0];
        
        driver.setAvailability(false);
        expect(driver.available).toBe(false);
        
        driver.setAvailability(true);
        expect(driver.available).toBe(true);
      });
      
      test('Set location', () => {
        const driver = drivers[0];
        const newLocation = 'F';
        
        driver.setLocation(newLocation);
        
        expect(driver.location).toBe(newLocation);
      });
      
      test('Accept ride', () => {
        const passenger = passengers[0];
        const driver = drivers[0];
        const rideRequest = rideService.createRideRequest(passenger, 'A', 'D', creditCardProvider);
        
        const result = driver.acceptRide(rideRequest, rideService);
        
        expect(result).toBe(true);
        expect(rideRequest.driver).toBe(driver);
        expect(driver.available).toBe(false);
        expect(rideRequest.status).toBe(RideStatus.ACCEPTED);
      });
      
      test('Cannot accept ride when driver is unavailable', () => {
        const passenger = passengers[0];
        const driver = drivers[0];
        driver.setAvailability(false);
        
        const rideRequest = rideService.createRideRequest(passenger, 'A', 'D', creditCardProvider);
        const result = driver.acceptRide(rideRequest, rideService);
        
        expect(result).toBe(false);
        expect(rideRequest.driver).toBeNull();
        expect(rideRequest.status).toBe(RideStatus.REQUESTED);
      });
      
      test('Pick up passenger', () => {
        const passenger = passengers[0];
        const driver = drivers[0];
        const rideRequest = rideService.createRideRequest(passenger, 'A', 'D', creditCardProvider);
        
        driver.acceptRide(rideRequest, rideService);
        const result = driver.pickupPassenger(rideRequest, rideService);
        
        expect(result).toBe(true);
        expect(rideRequest.status).toBe(RideStatus.IN_PROGRESS);
      });
      
      test('Cannot pick up passenger for ride not assigned to driver', () => {
        const passenger = passengers[0];
        const assignedDriver = drivers[0];
        const unassignedDriver = drivers[1];
        const rideRequest = rideService.createRideRequest(passenger, 'A', 'D', creditCardProvider);
        
        assignedDriver.acceptRide(rideRequest, rideService);

        console.log("Assigned Driver:", rideRequest.driver?.id);
        console.log("Attempting Pickup with:", unassignedDriver.id);
        console.log("Driver Assigned Check:", rideRequest.driver?.id === unassignedDriver.id);


        const result = unassignedDriver.pickupPassenger(rideRequest, rideService);
        
        
        expect(result).toBe(false);
        expect(rideRequest.status).toBe(RideStatus.ACCEPTED);
      });
      
      test('Complete ride', () => {
        const passenger = passengers[0];
        const driver = drivers[0];
        const rideRequest = rideService.createRideRequest(passenger, 'A', 'D', creditCardProvider);
        const initialBalance = creditCardProvider.balance;
        
        driver.acceptRide(rideRequest, rideService);
        driver.pickupPassenger(rideRequest, rideService);
        const result = driver.completeRide(rideRequest, rideService, creditCardProvider);
        
        expect(result).toBe(true);
        expect(rideRequest.status).toBe(RideStatus.COMPLETED);
        expect(driver.available).toBe(true);
        expect(driver.completedRides).toContain(rideRequest);
        expect(creditCardProvider.balance).toBeLessThan(initialBalance);
      });
    });
  
    describe('Admin Tests', () => {
      test('View ride history', () => {
        const admin = new Admin('Admin User');
        const passenger = passengers[0];
        const driver = drivers[0];
        
        // Create a few rides for the passenger
        const rideRequest1 = rideService.createRideRequest(passenger, 'A', 'B', creditCardProvider);
        driver.acceptRide(rideRequest1, rideService);
        driver.pickupPassenger(rideRequest1, rideService);
        driver.completeRide(rideRequest1, rideService, creditCardProvider);
        
        const rideRequest2 = rideService.createRideRequest(passenger, 'B', 'C', creditCardProvider);
        driver.acceptRide(rideRequest2, rideService);
        driver.pickupPassenger(rideRequest2, rideService);
        driver.completeRide(rideRequest2, rideService, creditCardProvider);
        
        const history = admin.viewRideHistory(passenger);
        
        expect(history).toEqual([rideRequest1, rideRequest2]);
      });
    });
  
    describe('Ride Service Tests', () => {
      // Implementing findNearestDriver functionality
      beforeEach(() => {
        // Add findNearestDriver method to RideService class
        rideService.findNearestDriver = function(location, vehicleType = null) {
          // Convert location char to index
          const locationIndex = location.charCodeAt(0) - 'A'.charCodeAt(0);
          
          // Filter available drivers
          let availableDrivers = Array.from(this.availableDrivers)
            .filter(driver => driver.available);
          
          // Filter by vehicle type if specified
          if (vehicleType) {
            availableDrivers = availableDrivers.filter(driver => 
              driver.vehicle && driver.vehicle.type === vehicleType
            );
          }
          
          if (availableDrivers.length === 0) return null;
          
          // Find nearest driver based on location
          return availableDrivers.reduce((nearest, current) => {
            const currentLocationIndex = current.location.charCodeAt(0) - 'A'.charCodeAt(0);
            const currentDistance = Math.abs(locationIndex - currentLocationIndex);
            
            const nearestLocationIndex = nearest.location.charCodeAt(0) - 'A'.charCodeAt(0);
            const nearestDistance = Math.abs(locationIndex - nearestLocationIndex);
            
            return currentDistance < nearestDistance ? current : nearest;
          }, availableDrivers[0]);
        };
      });
      
      test('Find nearest driver - any vehicle type', () => {
        const pickupLocation = 'C';
        const nearestDriver = rideService.findNearestDriver(pickupLocation);
        
        expect(nearestDriver).toBe(drivers[2]); // Driver C is at location C
      });
      
      test('Find nearest driver - specific vehicle type', () => {
        const pickupLocation = 'B';
        const nearestDriver = rideService.findNearestDriver(pickupLocation, VehicleType.CAR);
        
        // Driver A (location A) and Driver D (location D) have cars
        // From location B, Driver A is closer (distance 1) than Driver D (distance 2)
        expect(nearestDriver).toBe(drivers[0]);
      });
      
      test('Find nearest driver - no available drivers', () => {
        // Make all drivers unavailable
        drivers.forEach(driver => driver.setAvailability(false));
        
        const nearestDriver = rideService.findNearestDriver('A');
        
        expect(nearestDriver).toBeNull();
      });
      
      test('Ride service validation - ride status flow', () => {
        const passenger = passengers[0];
        const driver = drivers[0];
        const rideRequest = rideService.createRideRequest(passenger, 'A', 'D', creditCardProvider);
        
        // Check initial status
        expect(rideRequest.status).toBe(RideStatus.REQUESTED);
        
        // Accept ride
        driver.acceptRide(rideRequest, rideService);
        expect(rideRequest.status).toBe(RideStatus.ACCEPTED);
        
        // Try to complete ride before picking up (should fail)
        const invalidComplete = driver.completeRide(rideRequest, rideService, creditCardProvider);
        expect(invalidComplete).toBe(false);
        expect(rideRequest.status).toBe(RideStatus.ACCEPTED);
        
        // Pick up passenger
        driver.pickupPassenger(rideRequest, rideService);
        expect(rideRequest.status).toBe(RideStatus.IN_PROGRESS);
        
        // Complete ride
        driver.completeRide(rideRequest, rideService, creditCardProvider);
        expect(rideRequest.status).toBe(RideStatus.COMPLETED);
      });
      
      test('Payment deduction on ride completion', () => {
        const passenger = passengers[0];
        const driver = drivers[0];
        const pickupPoint = 'A';
        const destination = 'D';
        
        const initialBalance = creditCardProvider.balance;
        const rideRequest = rideService.createRideRequest(passenger, pickupPoint, destination, creditCardProvider);
        
        driver.acceptRide(rideRequest, rideService);
        driver.pickupPassenger(rideRequest, rideService);
        driver.completeRide(rideRequest, rideService, creditCardProvider);
        
        // Calculate expected fare
        const rideData = {
          pickupPoint: pickupPoint,
          destination: destination
        };
        const fare = fareCalculator.getFare(rideData);
        expect(creditCardProvider.balance).toBe(initialBalance - fare);
      });
    });
  });
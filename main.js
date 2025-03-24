// constants
const LENGTH = 10;
const PASSENGER_PREFIX = "PA"
const DRIVER_PREFIX = "DR"
const AGENT_PREFIX = "AG"
const ADMIN_PREFIX = "AD"
const WALLET_PREFIX = "WA"
const RIDE_PREFIX = "RIDE"

const generateRandomId = (length, prefix ) => {
    let randomeNumer = '';
    for(let i = 0; i < length; i++) {
        randomeNumer += Math.floor(Math.random()*10)
    }
    const generatedId = `${prefix}-${randomeNumer}`
    return generatedId
}


// Enums
const RideStatus = {
    REQUESTED: 'REQUESTED',
    ACCEPTED: 'ACCEPTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

const PaymentStatus = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED'
};

const VehicleType = {
    CAR: 'CAR',
    SUV: 'SUV',
    BIKE: 'BIKE'
};

const UserRole = {
    ADMIN: 'ADMIN',
    PASSENGER: 'PASSENGER',
    DRIVER: 'DRIVER'
};

const PaymentMethod = {
    CREDIT_CARD: 'CREDIT_CARD',
    PAYPAL: 'PAYPAL',
    CRYPTO: 'CRYPTO'
};

// Abstract base classes
class User {
    constructor(name, id) {
        if (this.constructor === User) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.name = name;
        this.id = id;
        this.role = null;
        this.createdAt = new Date();
    }
}
// Factory class for vehicle creation
class VehicleFactory {
    static createVehicle(type, id, model, plateNumber, capacity) {
        switch (type) {
            case VehicleType.CAR:
                return new Car(id, model, plateNumber, capacity);
            case VehicleType.SUV:
                return new Suv(id, model, plateNumber, capacity);
            case VehicleType.BIKE:
                return new Bike(id, model, plateNumber, capacity);
            default:
                throw new Error('Invalid vehicle type');
        }
    }
}

class Vehicle {
    constructor(id, model, plateNumber, capacity, type) {
        if (this.constructor === Vehicle) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.id = id;
        this.model = model;
        this.plateNumber = plateNumber;
        this.capacity = capacity;
        this.type = type;
        this.createdAt = new Date();
    }

    getType() {
        return this.type;
    }
}

// Concrete vehicle classes
class Car extends Vehicle {
    constructor(id, model, plateNumber, capacity) {
        super(id, model, plateNumber, capacity, VehicleType.CAR);
    }
}

class Suv extends Vehicle {
    constructor(id, model, plateNumber, capacity) {
        super(id, model, plateNumber, capacity, VehicleType.SUV);
    }
}

class Bike extends Vehicle {
    constructor(id, model, plateNumber, capacity) {
        super(id, model, plateNumber, capacity, VehicleType.BIKE);
    }
}

class PaymentProvider {
    constructor(id, name, method, inital_balance) {
        if (this.constructor === PaymentProvider) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.id = id;
        this.name = name;
        this.method = method;
        this.createdAt = new Date();
        this.balance = inital_balance
    }

    processPayment(payment) {
        throw new Error("Method 'processPayment()' must be implemented.");
    }
}

class PaymentMethodDetails {
    constructor(id, user, type) {
        if (this.constructor === PaymentMethodDetails) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.id = id;
        this.user = user;
        this.type = type;
        this.isDefault = false;
        this.createdAt = new Date();
    }

    isValid() {
        throw new Error("Method 'isValid()' must be implemented.");
    }
}

// Concrete classes for payment details
class CreditCardDetails extends PaymentMethodDetails {
    constructor(id, user, type, cardNumber, cardHolderName, expiryDate, encryptedCVV, billingAddress) {
        super(id, user, type);
        this.cardNumber = cardNumber;
        this.cardHolderName = cardHolderName;
        this.expiryDate = expiryDate;
        this.encryptedCVV = encryptedCVV;
        this.billingAddress = billingAddress;
    }

    maskCardNumber() {
        return this.cardNumber.replace(/\d{12}/, '************');
    }

    isValid() {
        // Basic validation for expiry date
        const currentDate = new Date();
        const [month, year] = this.expiryDate.split('/');
        const expiryDate = new Date(`20${year}`, month - 1);
        return expiryDate > currentDate;
    }
}

class PayPalDetails extends PaymentMethodDetails {
    constructor(id, user, type, email, accountId) {
        super(id, user, type);
        this.email = email;
        this.accountId = accountId;
    }

    isValid() {
        return this.email.includes('@') && this.accountId.length > 0;
    }
}

// Concrete classes for users
class Passenger extends User {
    constructor(name) {
        const id = generateRandomId(LENGTH, PASSENGER_PREFIX)
        super(name, id)
        this.role = UserRole.PASSENGER;
        this.rideHistory = [];
        this.paymentMethods = [];
        this.defaultPaymentMethod = null;
    }

    requestRide(pickupPoint, destination, rideService) {
        return rideService.createRideRequest(this, pickupPoint, destination);
    }

    cancelRide(rideRequest, rideService) {
        return rideService.cancelRideRequest(rideRequest, this);
    }

    addPaymentMethod(paymentDetails, method) {
        this.paymentMethods.push({ details: paymentDetails, method });
        return true;
    }

    removePaymentMethod(paymentMethodId) {
        this.paymentMethods = this.paymentMethods.filter(method => method.details.id !== paymentMethodId);
        return true;
    }

    setDefaultPaymentMethod(paymentMethodId) {
        const method = this.paymentMethods.find(method => method.details.id === paymentMethodId);
        if (method) {
            this.defaultPaymentMethod = method;
            return true;
        }
        return false;
    }
}

class Driver extends User {
    constructor(name, location) {
       const id = generateRandomId(LENGTH, DRIVER_PREFIX)
        super(name, id)
        this.role =  UserRole.DRIVER
        this.available = true;
        this.location = location;
        this.vehicle = null;
        this.completedRides = [];
    }


    assignVehicle(type, id, model, plateNumber, capacity) {
        this.vehicle = VehicleFactory.createVehicle(type, id, model, plateNumber, capacity);
        return true;
    }

    acceptRide(rideRequest, rideService){
        // validate driver vehicle before accepting orders
        if(!this.available || !this.vehicle) {
            return false;
        } 
        return rideService.assignDriver(rideRequest, this);
     }

    setAvailability(isAvailable) {
        this.available = isAvailable;
    }

    setLocation(location) {
        this.location = location;
    }

    pickupPassenger(rideRequest, rideService) {
        return rideService.pickupPassenger(rideRequest, this);
    }

    completeRide(rideRequest, rideService, paymentProvider) {
        return rideService.completeRide(rideRequest, this, paymentProvider);
    }
}

class Admin extends User {
    constructor(name) {
      const id = generateRandomId(LENGTH, ADMIN_PREFIX)
      super(name, id)
      this.role = UserRole.ADMIN
    }

    viewRideHistory(user) {
        return user.rideHistory || [];
    }
}


class RideQuery{
    constructor(pickupPoint, destination){
        this.pickupPoint = pickupPoint;
        this.destination = destination;
    }
   

}

// Ride-related classes
class RideRequest {
    constructor(id, passenger, pickupPoint, destination) {
        this.id = id;
        this.passenger = passenger;
        this.pickupPoint = pickupPoint;
        this.destination = destination;
        this.driver = null;
        this.status = RideStatus.REQUESTED;
        this.createdAt = new Date();
        this.completedAt = null;
        this.estimatedFare = null;
        this.payment = null;
        this.receipt = null;
    }

    getStatus() {
        return this.status;
    }

    // could be deleted since it's just returning the fare, not calcuating

    calculateFare() {
        return this.estimatedFare || 0;
    }

    generateReceipt() {
        this.receipt = new Receipt(`RECEIPT_${this.id}`, this);
        return this.receipt;
    }
}

class RideService {
    constructor() {
        this.rideRequests = [];
        this.lastRequestId = 0;
        this.availableDrivers = new Set();
        this.fareCalculator = new FareCalculator();
    }

    registerDriver(driver) {
        this.availableDrivers.add(driver);
        return true;
    }

    unRegisterDriver(driver) {
        this.availableDrivers.delete(driver);
        return true;
    }

    createRideRequest(passenger, pickupPoint, destination, paymentProvider) {
        // calculate fare for the ride
        const fare = this.calculateFare({ pickupPoint, destination });
        
        // check if user has sufficient balance before proceeding 
        if (!this._hasSufficientBalance(paymentProvider, fare)) {
            console.log(`Insufficient balance in payment provider. Ride request rejected.`);
            return false;
        }
        
        const rideRequest = new RideRequest(`RIDE_${++this.lastRequestId}`, passenger, pickupPoint, destination);
        rideRequest.estimatedFare = fare; 
        this.rideRequests.push(rideRequest);
        return rideRequest;
    }

    findNearestDriver(pickupPoint, vehicleType) {
        // the implementation for finding the nearest driver is the same for calculating the ride fare, checkout the FareCalculator clsss to know more about the approach
        let nearestDriver = null;
        let minDistance = Infinity;
    
        for (const driver of this.availableDrivers) {
          if (driver.available && (!vehicleType || driver.vehicle.type === vehicleType)) {
            const driverLocation = driver.location;
            const pickupIndex = pickupPoint.charCodeAt(0) - 'A'.charCodeAt(0);
            const driverIndex = driverLocation.charCodeAt(0) - 'A'.charCodeAt(0);
            const distance = Math.abs(driverIndex - pickupIndex);
    
            if (distance < minDistance) {
              minDistance = distance;
              nearestDriver = driver;
            }
          }
        }
    
        return nearestDriver;
      }

    calculateFare(rideData, peakHour ,badWeather) {
        return this.fareCalculator.getFare(rideData, peakHour ,badWeather);
    }

  
     assignDriver(rideRequest, driver) {
            rideRequest.driver = driver;
            driver.setAvailability(false);
            this.updateStatus(rideRequest, RideStatus.ACCEPTED);
            return true;
        }

    updateStatus(rideRequest, newStatus) {
           if (!Object.values(RideStatus).includes(newStatus)) {
               throw new Error("Invalid ride status");
           }
           rideRequest.status = newStatus;
           return true;
       }


    cancelRideRequest(rideRequest, requester) {
        if (rideRequest && rideRequest.passenger && rideRequest.passenger.id === requester.id) {
            this.updateStatus(rideRequest, RideStatus.CANCELLED);
            return true;
        }
        return false;
    }

        // Protected method that ensures only the assigned driver can pickup a passenger
        pickupPassenger(rideRequest, driver) {
        
          if (!this._isDriverAssignedToRide(rideRequest, driver)) {
            return false;
          }
          
          // Validate ride is in the correct state (ACCEPTED)
          if (rideRequest.status !== RideStatus.ACCEPTED) {
            return false;
          }
          
         
          return this.updateStatus(rideRequest, RideStatus.IN_PROGRESS);
        }
      


      // Protected method that ensures only the assigned driver can complete a ride
      completeRide(rideRequest, driver, paymentProvider) {
      
        if (!this._isDriverAssignedToRide(rideRequest, driver)) {
          return false;
        }
    
        // Validate ride is in the correct state (IN_PROGRESS)
        if (rideRequest.status !== RideStatus.IN_PROGRESS) {
          return false;
        }
    
        // Complete the ride
        const statusUpdated = this.updateStatus(rideRequest, RideStatus.COMPLETED);
        if (statusUpdated) {
          // Deduct fare from the payment provider's balance
          const fare = this.calculateFare({
            pickupPoint: rideRequest.pickupPoint,
            destination: rideRequest.destination
          });
          
          paymentProvider.balance -= fare;
    
          // Add ride to driver's completed rides
          driver.completedRides.push(rideRequest);

          // Add ride to passenger's rides history
          rideRequest.passenger.rideHistory.push(rideRequest)

          // Make driver available again
          driver.setAvailability(true);
          
          return true;
        }
        return false;
      }

    getRideHistory(user) {
        return this.rideRequests.filter(ride => ride.passenger.id === user.id || ride.driver?.id === user.id);
    }


    // Private helper method to validate driver is assigned to ride 
    _isDriverAssignedToRide(rideRequest, driver) {
        return rideRequest.driver && rideRequest.driver.id === driver.id;
      }

      // private helper method to validate the user payment provider before creating the ride
      _hasSufficientBalance( paymentProvider, fare){
        return paymentProvider.balance >= fare
      }
}

// Payment-related classes
class Payment {
    constructor(id, rideRequest, amount, method, paymentDetails) {
        this.id = id;
        this.rideRequest = rideRequest;
        this.amount = amount;
        this.method = method;
        this.status = PaymentStatus.PENDING;
        this.createdAt = new Date();
        this.processedAt = null;
        this.usesDirectPayment = false;
        this.paymentDetails = paymentDetails;
    }

    getStatus() {
        return this.status;
    }
}

class PaymentService {
    constructor() {
        this.payments = [];
        this.lastPaymentId = 0;
        this.paymentProviders = [];
        this.paymentDetailsService = new PaymentMethodDetailsService();
    }

    registerPaymentProvider(provider) {
        this.paymentProviders.push(provider);
        return true;
    }

    createPayment(rideRequest, amount, method, paymentDetails) {
        const payment = new Payment(`PAYMENT_${++this.lastPaymentId}`, rideRequest, amount, method, paymentDetails);
        this.payments.push(payment);
        return payment;
    }

    processPayment(payment) {
        const provider = this.paymentProviders.find(p => p.method === payment.method);
        if (provider) {
            payment.status = PaymentStatus.PROCESSING;
            const success = provider.processPayment(payment);
            payment.status = success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
            payment.processedAt = new Date();
            return success;
        }
        return false;
    }
}

class PaymentMethodDetailsService {
    constructor() {
        this.paymentDetails = [];
        this.lastPaymentDetailsId = 0;
    }

    createPaymentMethodDetails(user, method, details) {
        let paymentDetails;
        if (method === PaymentMethod.CREDIT_CARD) {
            paymentDetails = new CreditCardDetails(
                `PMD_${++this.lastPaymentDetailsId}`,
                user,
                method,
                details.cardNumber,
                details.cardHolderName,
                details.expiryDate,
                details.encryptedCVV,
                details.billingAddress
            );
        } else if (method === PaymentMethod.PAYPAL) {
            paymentDetails = new PayPalDetails(
                `PMD_${++this.lastPaymentDetailsId}`,
                user,
                method,
                details.email,
                details.accountId
            );
        } else {
            throw new Error("Unsupported payment method.");
        }
        this.paymentDetails.push(paymentDetails);
        return paymentDetails;
    }

    getPaymentMethodDetailsByUser(user) {
        return this.paymentDetails.filter(pd => pd.user.id === user.id);
    }

    updatePaymentMethodDetails(id, details) {
        const paymentDetail = this.paymentDetails.find(pd => pd.id === id);
        if (paymentDetail) {
            Object.assign(paymentDetail, details);
            return true;
        }
        return false;
    }

    deletePaymentMethodDetails(id) {
        this.paymentDetails = this.paymentDetails.filter(pd => pd.id !== id);
        return true;
    }

    getDefaultPaymentMethod(user) {
        return this.paymentDetails.find(pd => pd.user.id === user.id && pd.isDefault);
    }
}

class CreditCardPayment extends PaymentProvider {
    constructor(id, name, gatewayProvider, initial_balance) {
        super(id, name, PaymentMethod.CREDIT_CARD, initial_balance);
        this.gatewayProvider = gatewayProvider;
    }

    processPayment(payment) {
        if (this.balance >= payment.amount) {
            this.balance -= payment.amount; // Deduct fare from balance
            console.log(`Processing credit card payment via ${this.gatewayProvider}`);
            return true;
        } else {
            console.log(`Insufficient balance for credit card payment.`);
            return false;
        }
    }
}

class PayPalPayment extends PaymentProvider {
    constructor(id, name, merchantId, initial_balance) {
        super(id, name, PaymentMethod.PAYPAL, initial_balance);
        this.merchantId = merchantId;
    }

    processPayment(payment) {
        if (this.balance >= payment.amount) {
            this.balance -= payment.amount; 
            console.log(`Processing PayPal payment for merchant ${this.merchantId}`);
            return true;
        } else {
            console.log(`Insufficient balance for PayPal payment.`);
            return false;
        }
    }
}

class CryptoPayment extends PaymentProvider {
    constructor(id, name, blockchain, initial_balance) {
        super(id, name, PaymentMethod.CRYPTO, initial_balance);
        this.blockchain = blockchain;
    }

    processPayment(payment) {
        if (this.balance >= payment.amount) {
            this.balance -= payment.amount; 
            console.log(`Processing crypto payment on ${this.blockchain}`);
            return true;
        } else {
            console.log(`Insufficient balance for crypto payment.`);
            return false;
        }
    }
}

class Receipt {
    constructor(id, rideRequest) {
        this.id = id;
        this.rideRequest = rideRequest;
        this.createdAt = new Date();
        this.fare = rideRequest.calculateFare();
        this.taxes = this.fare * 0.1; // 10% tax
        this.totalAmount = this.fare + this.taxes;
        this.paymentMethod = rideRequest.payment?.method || null;
        this.paymentStatus = rideRequest.payment?.status || PaymentStatus.PENDING;
    }

    generatePDF() {
        // simulates digital recipet 
        return Buffer.from(`Receipt for Ride ${this.rideRequest.id}`);
    }

    sendToEmail(email) {
        //simulates  email sending logic
        console.log(`Receipt sent to ${email}`);
        return true;
    }
}


  class FareCalculator {
    constructor() {
      this.baseFare = 2.5;
      this.pricePerStep = 1;
      this.peakMultiplier = 1.5;
      this.weatherSurcharge = 1.25;
      this.minFare = 5.0;
    }
  
    isPeakHour() {
      const date = new Date();
      const hour = date.getHours()
      // Peak hours are 7-9 AM and 5-7 PM
      return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
    }
  
    isBadWeather() {
      // In a real system, this would call a weather API
      // For this example, we'll just return false
      return false;
    }
  
    // Modified to return both string representation and numeric value
    getFare(input, peakHour, badWeather) {
      let pickupPoint, destination;
      
      if (input instanceof RideRequest) {
        pickupPoint = input.pickupPoint;
        destination = input.destination;
      } else if (typeof input === "object" && input !== null) {
        pickupPoint = input.pickupPoint || input.pickup;
        destination = input.destination;
      } else {
        throw new Error("Invalid ride data: Expected a RideRequest or an object with pickupPoint and destination");
      }

      // In a real system, we would calculate distance between 
      // pickupPoint and destination using mapping services
      
      // in this scenario, pickup points and destinations are represented by alphabets A-Z.
      //  we'll use charCodeAt() to find the code of the char.
      //  then the fare is calculated based on the difference between the two chars. 
      // the price for each step is $1 - where each step represents a kilometer
  
      // Convert points to index for distance calculation
      const pickupIndex = pickupPoint.charCodeAt(0) - 'A'.charCodeAt(0);
      const dropOffIndex = destination.charCodeAt(0) - 'A'.charCodeAt(0);
      
      const distance = Math.abs(pickupIndex-dropOffIndex);
      
      let fare = this.baseFare + (distance * this.pricePerStep);
      
      // Apply multipliers
      if (this.isPeakHour() || peakHour) {
        fare *= this.peakMultiplier;
      }
      
      if (this.isBadWeather() || badWeather) {
        fare *= this.weatherSurcharge;
      }
      
      // Ensure minimum fare
      fare = Math.max(fare, this.minFare);
      
      // Round to 2 decimal places
      const roundedFare = Math.round(fare * 100) / 100;
      console.log("Distance is: ", distance, "KM");
      
      // Return numeric value for internal use
      return roundedFare;
    }
  }

  module.exports =  {
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
  };




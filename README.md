1. Overview
Description	Details
System Name	Ride-Sharing System
Purpose	Allows passengers to request rides, drivers to accept them, and completes the ride.
Design Principles	- Single Responsibility Principle (SRP)
- Open/Closed Principle (OCP)
- Don’t Repeat Yourself (DRY)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)
Key Focus	Extensibility through design patterns
2. Functional Requirements
2.1 Basic Ride Request
ID	Requirement
FR1	A Passenger should be able to create a ride request.
FR2	A Driver should be able to accept a ride request.
FR3	The system should follow the Single Responsibility Principle (SRP).
FR4	Unit tests should be implemented for core functionalities.
2.2 Ride Status and Completion
ID	Requirement
FR5	A ride should have statuses: Requested, Accepted, In Progress, and Completed.
FR6	The ride status system should be extendable following OCP.
FR7	The system should follow the DRY principle, avoiding redundant logic.
FR8	The ride should be marked as completed when finished.
2.3 Vehicle Type & Liskov Substitution Principle (LSP)
ID	Requirement
FR9	Different vehicle types (Car, Bike, SUV) should be supported.
FR10	Drivers should be assignable to any vehicle type without breaking functionality.
FR11	Common vehicle behaviors should be defined in an abstract class or interface to encourage code reuse.
2.4 Interface Segregation Principle (ISP)
ID	Requirement
FR12	Different user roles (Passengers, Drivers, Admins) should have distinct interfaces.
FR13	A Passenger should not need to implement methods meant for a Driver and vice versa.
FR14	Separate interfaces should be introduced (e.g., RideRequester, RideProvider).
2.5 Dependency Inversion Principle (DIP) & Extensibility
ID	Requirement
FR15	Introduce a Payment System supporting multiple providers (CreditCardPayment, PayPalPayment, CryptoPayment).
FR16	The system should depend on an abstraction rather than specific payment providers.
FR17	New payment methods should be supported without modifying core ride logic.
2.6 Bonus: Design Patterns & Extensibility
ID	Requirement
FR18	Use the Factory Pattern to create vehicles dynamically.
FR19	Use the Observer Pattern to notify passengers and drivers of ride status changes.
2.7 Bonus: Ride Cancellation
ID	Requirement
FR20	A Passenger should be able to cancel a Ride before picking up.
2.8 Bonus: Ride Completion Validation
ID	Requirement	Description
FR21	Ride Completion Validation with Auto-Confirm and Dispute Window	The system must allow a driver to mark a ride as completed. If the passenger is online, they will be prompted to confirm the completion. If the passenger does not confirm within 15 minutes, the system will automatically mark the ride as completed. Passengers have a 24-hour dispute window to report incorrect ride completions.
3. Non-Functional Requirements
ID	Requirement
NFR1	The system should be scalable to support multiple concurrent users.
NFR2	Security measures should be in place to protect user data.
NFR3	The system should have high availability and reliability.
NFR4	Response times should be optimized for real-time ride requests.

4. Class Diagram
![mermaid-diagram-2025-03-24-024231](https://github.com/user-attachments/assets/d63df5d2-3f8a-43e3-9f3c-be58360b7c57)


5. References
Reference	Description
Pohl, K., & Rupp, C.	Requirements Engineering Fundamentals: A Study Guide for the Certified Professional for Requirements Engineering Exam, Foundation Level, IREB compliant, 2ⁿᵈ ed. USA: Rocky Nook Inc.
Fowler, M., & Scott, K.	UML distilled: A brief guide to the standard object modelling language. Addison Wesley Professional.
Uber System Design by TechPrep	YouTube Video

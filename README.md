
## 1. Overview

| Description | Details |
|-------------|---------|
| **System Name** | Ride-Sharing System |
| **Purpose** | Allows passengers to request rides, drivers to accept them, and completes the ride. |
| **Design Principles** | - Single Responsibility Principle (SRP) <br> - Open/Closed Principle (OCP) <br> - Don’t Repeat Yourself (DRY) <br> - Liskov Substitution Principle (LSP) <br> - Interface Segregation Principle (ISP) <br> - Dependency Inversion Principle (DIP) |
| **Key Focus** | Extensibility through design patterns |

---

## 2. Functional Requirements

### 2.1 Basic Ride Request

| ID   | Requirement |
|------|-------------|
| **FR1** | A Passenger should be able to create a ride request. |
| **FR2** | A Driver should be able to accept a ride request. |
| **FR3** | The system should follow the Single Responsibility Principle (SRP). |
| **FR4** | Unit tests should be implemented for core functionalities. |

### 2.2 Ride Status and Completion

| ID   | Requirement |
|------|-------------|
| **FR5** | A ride should have statuses: Requested, Accepted, In Progress, and Completed. |
| **FR6** | The ride status system should be extendable following OCP. |
| **FR7** | The system should follow the DRY principle, avoiding redundant logic. |
| **FR8** | The ride should be marked as completed when finished. |

### 2.3 Vehicle Type & Liskov Substitution Principle (LSP)

| ID   | Requirement |
|------|-------------|
| **FR9** | Different vehicle types (Car, Bike, SUV) should be supported. |
| **FR10** | Drivers should be assignable to any vehicle type without breaking functionality. |
| **FR11** | Common vehicle behaviors should be defined in an abstract class or interface to encourage code reuse. |

### 2.4 Interface Segregation Principle (ISP)

| ID   | Requirement |
|------|-------------|
| **FR12** | Different user roles (Passengers, Drivers, Admins) should have distinct interfaces. |
| **FR13** | A Passenger should not need to implement methods meant for a Driver and vice versa. |
| **FR14** | Separate interfaces should be introduced (e.g., RideRequester, RideProvider). |

### 2.5 Dependency Inversion Principle (DIP) & Extensibility

| ID   | Requirement |
|------|-------------|
| **FR15** | Introduce a Payment System supporting multiple providers (CreditCardPayment, PayPalPayment, CryptoPayment). |
| **FR16** | The system should depend on an abstraction rather than specific payment providers. |
| **FR17** | New payment methods should be supported without modifying core ride logic. |

### 2.6 Bonus: Design Patterns & Extensibility

| ID   | Requirement |
|------|-------------|
| **FR18** | Use the Factory Pattern to create vehicles dynamically. |
| **FR19** | Use the Observer Pattern to notify passengers and drivers of ride status changes. |

### 2.7 Bonus: Ride Cancellation

| ID   | Requirement |
|------|-------------|
| **FR20** | A Passenger should be able to cancel a Ride before picking up. |

### 2.8 Bonus: Ride Completion Validation

| ID   | Requirement | Description |
|------|-------------|-------------|
| **FR21** | Ride Completion Validation with Auto-Confirm and Dispute Window | The system must allow a driver to mark a ride as completed. If the passenger is online, they will be prompted to confirm the completion. If the passenger does not confirm within 15 minutes, the system will automatically mark the ride as completed. Passengers have a 24-hour dispute window to report incorrect ride completions. |

---

## 3. Non-Functional Requirements

| ID   | Requirement |
|------|-------------|
| **NFR1** | The system should be scalable to support multiple concurrent users. |
| **NFR2** | Security measures should be in place to protect user data. |
| **NFR3** | The system should have high availability and reliability. |
| **NFR4** | Response times should be optimized for real-time ride requests. |


## 4. Assumptions
* The system supports multiple vehicle types without requiring explicit checks.
* The payment system must integrate seamlessly with multiple providers.
## 5. Constraints
* The system should be designed to be extendable and modular.
* Ride status updates should be event-driven rather than manually handled via conditionals.
* Business logic should be separated from UI considerations.

## 6. [Class Diagram](https://mermaid.ink/svg/pako:eNrlWm1v2zYQ_iuCgAD26gZJ1qarUQRwbKc1lrqenaTYEGBgJNohordRlFOvS3_7jiIpkRTl2Os-DFg_RNLxjnd87oU8ul_9IA2x3_eDCOX5iKAVRfFt4sG_gwNvnBRx7onPksGbkxAvGGJF7n0VdP7v3TsMnJgiRtLk7KwemI9_uR4vrsajmjQYDsczgzKZ_j6bf3o_Hy8WNXH46ePscmzwDQfT4fjyUpGeyodu3AxtYpywPeybjaejyfS9Rph_GoIdBs1hysVgcql_z8cX19ORaZk06gbfkyDCV5sM72TScDCvPxbXN_XH-eTnsUPBdY7pPI12m30w-jiZassdLBbj6fvx3Ktpo_nkZjx3KJLwfsTsPg13W8t8PJpc_Q5LGuk6f50NLm-TSoN4qYJucJczigLm3aEcC9U4txdsqkdSRNf9YsEoSVZegmLcpJJQo1UIUvij0UeIgQEUwyMcMEugwyfuwURdAyqH63e31bBK0mLIz6hJziKwalrEd5hqg4LgBShDAWEbbUQPQwZ_dlmmlOmQsCfM6Olqe5WaXjljV5NcYcY1dbp6-LfiJANrRtM1lBf6fXhZ_jaDNi4fu6zdsqnEQHhczKGvNqNpgPNcinQy8ex65ynEE0oaoe5IpxFmiET5P1x6mRFFboSCuXDL5dIyj-QjvERFxPaAxDC4xIVrbsYAyW9QRMKOhkPD_5DuwzQBZazKdG-ZUk9C6IVCiw7bkOKQsCGiLswUOgEMN5JDG_uQRuDUqbM04C8ZoRuOgmMMbN1kAMzw5qY5ekeiCJ6DMKQQDtp4w2YNtqCm6ujFKH8YVqsAEIWOPfGtIm2Goi1w4RhGmmQUBGmRsEloBkE9l7aMcop93F-baZoKMZCszCLwYkAp2ngUEvEDyVlKN42xTI_NvDUNQhHtBtFgltrL4q6vhuI_CpwzfvzpZCR4KLJZShLWgxlzRpJy5-uVFi4wXZMAd8uj0lyIaRMFKAlwVM5DawZL1ECsFENhaBitiox0RFWVHKIUx-kaO6XF18QplmM2cqD1jKgj-kaUrC1_qvKD1mA8uoscmRalQQlqczvy1uLZiIEgjbMIKknI0dVjQFggN2w1se5dMJOsErXdyfmdbggCnLG9vQdYDsRSSQT7ZYfkA7XyrrdOjVoOvJfSxE5lq80kQ7AK132MUTDtugrn5jUIY5KYOcopjbxZE_w4r_O2w4tF1yv99U1LkG9SpDWINF5XASPOLIaqIN8c56c6iZuDWlI3wsgLy4dG13qivHzsspmKARWxxpA8xHEbYi53gajjRKNKnm4IDjDJmEfF0zJRwlfW7AqYntdWzazjnFhgp6t1gEZVi4KCHw25rcDU2HtXOOH9AZYm8nl0I1s8LoOxZS-QC8qb0MEETI4am9cCs7rmCHfq0tz4oVwJHEKWxqftcGFax9wkVhDmmMp6IwKl6_UdSVgk892ZRfzoPtzFfy0b0JIk4RTD0nImVasq01OVlR_Wu7JutzqZewCCGHGTreokyqmc3agwapUOQLJQrlFGmiGX4EdBdoluLYbtGuudWKFqFkPx0iLbWkPb9UES7VEJtb5CD0u-K2j6zEx7ss9Ura3WszVUr7fUGUcy1VDMj4i7N1zmHc2e9VICYg2p0wQgmo8IFD91Ynmmd_HMM1STuyyVhnfFatVpq2fN0FYyjTU_1wW31zyprKXeSXGj3hlyqpXNn4FFGWCuTVIdntxSCO0mOpMv3dYip5DfB3Wv6e5nO3LN1GWRhBYjNLPpZxRBhjdFWlKtvad_1qHN-Gu6VfJMwt2cZ3jDQNbs3kXvpnANLUANXjO2XRznm_JeTC9sLrZvjarferFQGdT0W4h5_W2RbCm_zn5GmNu-YqthtS8hthTUFSztEdplGfTO-wC90oj-xJLq_ntR7WJkaXadiVDvPJYPlW4u7jXv6GuHKcDdbmq9iNgCWYxpcI-cVw5NpGrm_xRIj4TdhxQ9XtA0dgr1vDuUPIzaY_t7YR7yO6p0C8x3cOR7AOxIYgSlJqXBXDP_72F2dCmy5fr-81TryUduBkuzC5RUhr5gx87BUoaigX00U61vy-2XOdzo8VTrZh2Kuo4ubza64Pd-xXJplD04n4dX6ZjfFHbEfeGzoWy2ZDXKLy6iFImfiIz2WNIzCpvgDNMFw1ljDKOHj7ANkCwimnly9BEccA-CBa8tdNWYOSaJqZDkM5jwQ1rwS9pm9wbj5yj8LGZ1c8DOVHVU1bleNVUGMgcH3iSBeQjjvQu0KKIjyO9JJj1V_hLw7q-XL8UNjU2cmRci9YDe7Kl7tnIANikH9Zw8YAd5UazrNLF_1RHT2TvfFl6j7gOfwWqe5K25jQ28XcC4y7Z_hczzNCACXg8l_Oo4g_DFSUCwjvXLl2f1L7B97x7lymfyuujWP771gU2-KLxKVu9MmahurDTuH-BFLxt91ZJWYk0NTRkwbY0rCf1SZatYjBK0cssdHp7p_w2gX_ZdNZuao8GmQaPzWfiogtr3VDEpjbC8o_a2fANtRuxKhC0qlLDlAkHkZps9qrS8hUn2uToKiktTe3R4qGk2Q5H7FeokRBa2rWlxVb0Ay007iVVJxhWLPm2HCdrMV6wCAGueSpULMMKvULSGtkwnt8k2YE2_OW3abTITQ7_nw7kSNqfQ7_vlfnPrQ-mO8a3fh9cQ0Ydb_zZ5Aj5UsHSxSQK_z2iBez5Ni9W931-iKIcv0drI_1GjWDKU_Jam-qff_-p_8fvHp4dvjt7-eHx8_PbVm1fHb057_sbvvzo6fH10_Pr09QkMnr46Onnq-X-W8keHb9_-dHJyAtzHJ0enp6evn_4GmQRKaQ)

![mermaid-diagram-2025-03-24-024231](https://github.com/user-attachments/assets/713df47e-8113-4ebd-a28e-7f72124bb4f8)


## 7. Considerations : 
...In real life ride sharing system, fare is calculated based on several factros such as : 
* Distance
* Peak hours
* Weather condition

...However, in this simple ride sharing system, we have not used any external API to find the distance between pickup point and distnation. We simply Assume that rides should only be serveed to any point between A-Z. Where the distance between each character represents 1km, and the price per each km is x.

  E.g. pickupPoint = 'A', destination = 'V'
  To find the fare for this ride we will find the distance between A-V.

      const pickupIndex = pickupPoint.charCodeAt(0) - 'A'.charCodeAt(0);
      const dropOffIndex = destination.charCodeAt(0) - 'A'.charCodeAt(0);
      const distance = Math.abs(pickupIndex-dropOffIndex);
      let fare = this.baseFare + (distance * this.pricePerStep);
      
      // Apply multipliers
      if (this.isPeakHour()) {
        fare *= this.peakMultiplier;
      }
      
      if (this.isBadWeather()) {
        fare *= this.weatherSurcharge;
      }
      
      // Ensure minimum fare
      fare = Math.max(fare, this.minFare);
      
      // Round to 2 decimal places
      const roundedFare = Math.round(fare * 100) / 100;

* Finding the nearest driver follows the very same approach.


## 8. Resource: 
* Pohl, K., & Rupp, C. (2015). Requirements Engineering Fundamentals: A Study Guide for the Certified Professional for Requirements Engineering Exam, Foundation Level, IREB compliant, 2ⁿᵈ ed. USA: Rocky Nook Inc.
* Fowler, M., & Scott, K. (2003). UML distilled: A brief guide to the standard object modelling language. Addison Wesley Professional.
Uber System Design by TechPrep [https://youtu.be/DGtalg5efCw?si=biy-yr_1TxuIg_f2]
* OOP Principles [https://www.interviewbit.com/blog/principles-of-oops/]


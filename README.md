# Event Ticket Booking Information System

## Overview

The task is to design an information system for booking tickets for cultural events such as film screenings, lectures, and performances held in managed halls.

The system allows users to manage halls, cultural events, performances, and seat reservations.

## Used Technologies

The assignment was implemented using Laravel as the framework for the backend and React.js + TypeScript as the tech for the frontend.

---

## Core Concepts

### Halls

Each hall has:
- A unique designation (name/identifier)
- Attributes such as:
  - Address
  - Seat scheme

Each hall contains a fixed number of seats.  
Seats are defined as a matrix:

- Row number
- Seat number within the row

Example seat representation: `[row, seat]`

---

### Seats

- Represented as a 2D structure (rows × seats)
- Each seat is uniquely identifiable within a hall
- Seats can be either:
  - Available
  - Reserved / Occupied

---

### Cultural Events

Each cultural event:
- Takes place in a specific hall
- Occurs during a defined time interval
- Has a defined price

---

### Performances

A performance is a reusable concept that can occur multiple times across different halls.

Each performance includes:
- Title
- Type (e.g. film, lecture, performance)
- Image
- Genre (tags)
- Performers
- Ratings
- Other descriptive metadata

---

## User Roles

### Administrator
- Manages users
- Has all permissions of other roles:
  - Editor
  - Cashier
  - Spectator

---

### Editor
- Inserts and manages:
  - Halls
  - Performances
  - Cultural events
  - Content shown to users and visitors
- Can upload images for performances
- Inherits spectator permissions

---

### Cashier
- Registers and manages reservations for selected halls
- Confirms reservations
- Inherits spectator permissions

---

### Spectator (Registered User)
- Can reserve 1 to N seats (business rule dependent, e.g. payment limit or seat count restriction)
- Can cancel reservations (via cashier rules or system constraints)
- Tracks reservation status (e.g. payment status)
- Can edit personal profile
- Inherits unregistered visitor permissions

---

### Unregistered Visitor
- Can browse and search cultural events by various filters
- Can make reservations without registration (must provide necessary data)
- Has the option to register and become a spectator
- Can view seat availability (occupied vs free)
- In case of simultaneous reservation attempts:
  - The system must notify slower users if seats are already taken

---

## Key Functional Requirements

### Event Browsing
Users can search cultural events by:
- Title
- Type
- Genre
- Date/time
- Hall

---

### Seat Reservation
- Users can select seats visually or by identifier
- System must prevent double booking
- Concurrent reservation handling must ensure consistency

---

### Reservation Rules
- Reservation may require:
  - User registration OR guest data input
- Payment and confirmation handled by cashier role or system logic

---

## Notes

- The system must support concurrent users safely
- Seat allocation must be atomic to prevent conflicts
- Roles are hierarchical:
  - Administrator > Editor/Cashier/Spectator > Visitor


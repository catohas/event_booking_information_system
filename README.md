# Event Ticket Booking Information System

## Overview

The task is to design an information system for booking tickets for cultural events such as film screenings, lectures, and performances held in managed halls.

The system allows users to manage halls, cultural events, performances, and seat reservations.

## Used Technologies

The assignment was implemented using Laravel as the framework for the backend and React.js + TypeScript as the tech for the frontend.

### Original assignment

The task of the assignment is to create an information system for booking tickets for cultural events (film screenings, lectures, performances, etc.) held in managed halls.

Each hall has a designation by which its visitors will be able to distinguish it appropriately and other attributes (e.g. address, seating chart, etc.).

Each hall has a fixed number of seats, where each seat is defined by a row and a seat number in the row; it can be considered as a matrix [row, seat]).

Each cultural event takes place in a hall, at a certain time interval and costs a certain price.

A cultural event further relates to a performance that can be repeatedly held in multiple halls.

This performance is characterized by a description: name, type (film, lecture, performance, etc.), image, genre (tags), performers, rating, etc.

Users will be able to use the information system both for entering halls, performances and events, and for reserving seats at the event.


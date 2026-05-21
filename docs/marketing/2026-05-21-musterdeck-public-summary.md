# MusterDeck Public Summary

Date: 2026-05-21

## Overview

MusterDeck is an independent fan-made operations platform for Star Citizen players, organizations, event hosts, and competitive communities.

The goal is simple: help crews find each other, plan serious operations, manage rewards fairly, and run organized tournaments without relying on scattered spreadsheets, Discord threads, and last-minute voice-channel chaos.

MusterDeck is built around four connected pillars.

## Rally Point

Rally Point helps players find or publish operations. Hosts can post events, list needed roles, request ships, set trust requirements, manage applicants, and give players a clear path to join the crew.

## Fleet Command

Fleet Command gives org leaders and officers tools to plan and run operations. It supports ship requests, staffing profiles, crew assignments, teams, officer workflows, roster locks, live updates, and command-facing views for complex events.

## S.P.O.I.L.S.

S.P.O.I.L.S. handles post-event settlement: loot, payouts, inventory, rewards, claims, org-bank reserves, and payout history. It is designed for mining, salvage, cargo, rare rewards, ship components, ship weapons, sale proceeds, and tournament prizes.

## Proving Ground

Proving Ground supports tournaments and competitive events. Organizers can run signups, seed teams, manage brackets, publish waves, enter scores, track standings, and handle 1v1, 2v2, 3v3, 4v4, 5v5, and custom formats. Planned formats include single elimination, double elimination with losers brackets, round robin, Swiss, leaderboards, and group-stage-to-finals structures.

## Who It Is For

MusterDeck is for:

- Star Citizen org leaders planning large operations.
- Fleet Admirals and officers managing ship and crew assignments.
- Players looking for coordinated mining, salvage, cargo, combat, racing, medical, or support runs.
- Quartermasters handling loot, rewards, and payout records.
- Tournament organizers running Discord-hosted or in-person events.
- Communities that need practical tools for recurring operations and competitive play.

The platform is designed to respect the full Star Citizen crew, not just combat roles. Pilots, gunners, engineers, miners, salvagers, haulers, medics, scouts, logistics crews, marines, quartermasters, tournament admins, and support players all have a place in the system.

## Planned Features

Planned features include:

- Account profiles.
- Discord and Google sign-in.
- RSI handle verification.
- Public and private event listings.
- Join links and join codes.
- Applicant approval.
- Notifications.
- Admin tools.
- Tournament registration.
- Bracket management.
- Score reporting.
- Prize tracking.
- Ship catalog data.
- Staffing templates.
- Shared legal, status, and version surfaces.

## Tech Summary

MusterDeck is planned as a modern web application using React, Vite, TypeScript, Supabase, and Postgres.

The backend direction includes Supabase Auth, row-level security, structured migrations, SQL smoke tests, profile and identity tables, notification systems, event data, tournament data, prize ledgers, and ship/catalog sync tooling.

The frontend direction is a responsive operational console for desktop, tablet, and phone, with shared navigation, admin views, public pages, authenticated app modules, and future PWA/mobile notification support.

## Fan-Project Notice

MusterDeck is an independent fan-made tool. It is not affiliated with, endorsed by, sponsored by, or officially connected to Cloud Imperium Games, Roberts Space Industries, or their affiliates.

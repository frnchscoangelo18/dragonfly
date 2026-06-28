-- Supabase Database Schema for Projects
-- Based on ProjectModel type

CREATE TYPE project_tag AS ENUM ('Robotics', 'IoT', 'Power', 'Networking', 'Mechatronics', 'N/A');

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    tag project_tag NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO projects (id, name, time, tag)
VALUES 
('proj_01', 'Line-Following Robot', '2026-06-26T00:00:00.000Z', 'Robotics'),
('proj_02', 'ESP32 Weather Node', '2026-06-23T00:00:00.000Z', 'IoT'),
('proj_03', 'Motion Detector Alarm', '2026-06-21T00:00:00.000Z', 'Mechatronics'),
('proj_04', 'Automatic 12V Charger', '2026-06-21T00:00:00.000Z', 'Power');

-- Supabase Database Schema for Project Edges
-- Based on ProjectEdgeModel type

CREATE TYPE connection_type AS ENUM ('power', 'signal', 'logic', 'i2c');

CREATE TABLE IF NOT EXISTS project_edges (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    source_handle TEXT,
    target_handle TEXT,
    label TEXT,
    type connection_type,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO project_edges (id, project_id, source_id, target_id, source_handle, target_handle, label, type)
VALUES 
('proj_01_e1', 'proj_01', 'proj_01_comp_pwr_01', 'proj_01_comp_act_01', 'bottom', 'top', '7.4V VMOT', 'power'),
('proj_01_e2', 'proj_01', 'proj_01_comp_pwr_01', 'proj_01_comp_mcu_01', 'bottom', 'top', '7.4V VIN', 'power'),
('proj_01_e3', 'proj_01', 'proj_01_comp_mcu_01', 'proj_01_comp_sns_01', 'bottom', 'top', '5V VCC', 'power'),
('proj_01_e5', 'proj_01', 'proj_01_comp_sns_01', 'proj_01_comp_mcu_01', 'bottom', 'top', 'Sensor Data', 'signal'),
('proj_01_e6', 'proj_01', 'proj_01_comp_mcu_01', 'proj_01_comp_act_01', 'bottom', 'top', 'PWM / DIR', 'signal'),
('proj_01_e7', 'proj_01', 'proj_01_comp_act_01', 'proj_01_comp_act_02', 'bottom', 'top', 'Drive Current', 'power'),
('proj_01_e_nand_in1', 'proj_01', 'proj_01_comp_sns_01', 'proj_01_comp_log_01', 'bottom', 'top', 'Line Lost', 'logic'),
('proj_01_e_nand_out', 'proj_01', 'proj_01_comp_log_01', 'proj_01_comp_act_04', 'bottom', 'top', 'Buzzer', 'signal'),
('proj_02_e9', 'proj_02', 'proj_02_comp_pwr_02', 'proj_02_comp_mcu_02', 'bottom', 'left', 'Battery', 'power'),
('proj_02_e12', 'proj_02', 'proj_02_comp_sns_02', 'proj_02_comp_mcu_02', 'bottom', 'right', 'I2C Data', 'i2c'),
('proj_02_e13', 'proj_02', 'proj_02_comp_mcu_02', 'proj_02_comp_act_03', 'bottom', 'top', 'Display Data', 'i2c'),
('proj_03_e_pwr_sns', 'proj_03', 'proj_03_comp_pwr_04', 'proj_03_comp_sns_03', 'right', 'left', '9V VCC', 'power'),
('proj_03_e_in', 'proj_03', 'proj_03_comp_sns_03', 'proj_03_comp_log_02', 'bottom', 'top', 'Trigger', 'signal'),
('proj_03_e_pwr_log', 'proj_03', 'proj_03_comp_pwr_04', 'proj_03_comp_log_02', 'bottom', 'left', '9V VCC', 'power'),
('proj_03_e_rc1', 'proj_03', 'proj_03_comp_pas_01', 'proj_03_comp_log_02', 'bottom', 'right', 'Timing R', 'logic'),
('proj_03_e_rc2', 'proj_03', 'proj_03_comp_pas_02', 'proj_03_comp_log_02', 'bottom', 'right', 'Timing C', 'logic'),
('proj_03_e_out', 'proj_03', 'proj_03_comp_log_02', 'proj_03_comp_act_04', 'bottom', 'top', 'Alarm Signal', 'signal'),
('proj_04_e_trans', 'proj_04', 'proj_04_comp_pwr_trans', 'proj_04_comp_pwr_rect', 'bottom', 'top', '12V AC', 'power'),
('proj_04_e_rect', 'proj_04', 'proj_04_comp_pwr_rect', 'proj_04_comp_pwr_03', 'bottom', 'top', 'DC Bus', 'power'),
('proj_04_e_relay', 'proj_04', 'proj_04_comp_pwr_03', 'proj_04_comp_act_05', 'bottom', 'top', 'Cutoff', 'signal'),
('proj_04_e_zener', 'proj_04', 'proj_04_comp_log_zener', 'proj_04_comp_pwr_03', 'bottom', 'right', 'V-Ref', 'logic'),
('proj_04_e_led', 'proj_04', 'proj_04_comp_act_05', 'proj_04_comp_act_led', 'right', 'left', 'Full Status', 'signal');

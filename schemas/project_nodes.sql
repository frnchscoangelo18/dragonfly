-- Supabase Database Schema for Project Nodes
-- Based on ProjectNodeModel type

CREATE TABLE IF NOT EXISTS project_nodes (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    component_id TEXT NOT NULL, -- References inventory(id), but kept as TEXT for flexibility
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO project_nodes (id, project_id, component_id, position_x, position_y)
VALUES 
('proj_01_comp_pwr_01', 'proj_01', 'comp_pwr_01', 286, 380),
('proj_01_comp_mcu_01', 'proj_01', 'comp_mcu_01', 468, -88),
('proj_01_comp_sns_01', 'proj_01', 'comp_sns_01', 42, 0),
('proj_01_comp_act_01', 'proj_01', 'comp_act_01', 390, 126),
('proj_01_comp_log_01', 'proj_01', 'comp_log_01', 462, 158),
('proj_01_comp_act_02', 'proj_01', 'comp_act_02', -50, 300),
('proj_01_comp_act_04', 'proj_01', 'comp_act_04', 550, 450),
('proj_02_comp_pwr_02', 'proj_02', 'comp_pwr_02', 50, 0),
('proj_02_comp_sns_02', 'proj_02', 'comp_sns_02', 550, 0),
('proj_02_comp_mcu_02', 'proj_02', 'comp_mcu_02', 300, 150),
('proj_02_comp_act_03', 'proj_02', 'comp_act_03', 300, 300),
('proj_03_comp_pwr_04', 'proj_03', 'comp_pwr_04', 0, 0),
('proj_03_comp_sns_03', 'proj_03', 'comp_sns_03', 250, 0),
('proj_03_comp_pas_01', 'proj_03', 'comp_pas_01', 550, 0),
('proj_03_comp_pas_02', 'proj_03', 'comp_pas_02', 800, 0),
('proj_03_comp_log_02', 'proj_03', 'comp_log_02', 250, 150),
('proj_03_comp_act_04', 'proj_03', 'comp_act_04', 250, 300),
('proj_04_comp_pwr_trans', 'proj_04', 'comp_pwr_trans', 250, 0),
('proj_04_comp_pwr_rect', 'proj_04', 'comp_pwr_rect', 250, 150),
('proj_04_comp_pwr_03', 'proj_04', 'comp_pwr_03', 250, 300),
('proj_04_comp_act_05', 'proj_04', 'comp_act_05', 250, 450),
('proj_04_comp_log_zener', 'proj_04', 'comp_log_zener', 550, 150),
('proj_04_comp_act_led', 'proj_04', 'comp_act_led', 550, 450);

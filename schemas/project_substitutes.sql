-- Supabase Database Schema for Project Substitutes
-- Based on ProjectSubstituteModel type

CREATE TABLE IF NOT EXISTS project_substitutes (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    original_component_id TEXT NOT NULL,
    substitute_component_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO project_substitutes (id, project_id, original_component_id, substitute_component_id)
VALUES 
('sub_proj_01_sns_01_alt1', 'proj_01', 'comp_sns_01', 'comp_sns_01_alt1'),
('sub_proj_01_sns_01_alt2', 'proj_01', 'comp_sns_01', 'comp_sns_01_alt2'),
('sub_proj_01_sns_01_alt3', 'proj_01', 'comp_sns_01', 'comp_sns_01_alt3'),
('sub_proj_01_log_01_alt1', 'proj_01', 'comp_log_01', 'comp_log_01_alt1'),
('sub_proj_01_log_01_alt2', 'proj_01', 'comp_log_01', 'comp_log_01_alt2'),
('sub_proj_01_log_01_alt3', 'proj_01', 'comp_log_01', 'comp_log_01_alt3'),
('sub_proj_01_mcu_01_alt1', 'proj_01', 'comp_mcu_01', 'comp_mcu_01_alt1'),
('sub_proj_01_mcu_01_alt2', 'proj_01', 'comp_mcu_01', 'comp_mcu_01_alt2'),
('sub_proj_01_mcu_01_alt3', 'proj_01', 'comp_mcu_01', 'comp_mcu_01_alt3'),
('sub_proj_01_act_01_alt1', 'proj_01', 'comp_act_01', 'comp_act_01_alt1'),
('sub_proj_01_act_01_alt2', 'proj_01', 'comp_act_01', 'comp_act_01_alt2'),
('sub_proj_01_act_01_alt3', 'proj_01', 'comp_act_01', 'comp_act_01_alt3'),
('sub_proj_02_sns_02_alt1', 'proj_02', 'comp_sns_02', 'comp_sns_02_alt1'),
('sub_proj_02_sns_02_alt2', 'proj_02', 'comp_sns_02', 'comp_sns_02_alt2'),
('sub_proj_02_sns_02_alt3', 'proj_02', 'comp_sns_02', 'comp_sns_02_alt3'),
('sub_proj_02_mcu_02_alt1', 'proj_02', 'comp_mcu_02', 'comp_mcu_02_alt1'),
('sub_proj_02_mcu_02_alt2', 'proj_02', 'comp_mcu_02', 'comp_mcu_02_alt2'),
('sub_proj_02_mcu_02_alt3', 'proj_02', 'comp_mcu_02', 'comp_mcu_02_alt3'),
('sub_proj_03_sns_03_alt1', 'proj_03', 'comp_sns_03', 'comp_sns_03_alt1'),
('sub_proj_03_sns_03_alt2', 'proj_03', 'comp_sns_03', 'comp_sns_03_alt2'),
('sub_proj_03_sns_03_alt3', 'proj_03', 'comp_sns_03', 'comp_sns_03_alt3');

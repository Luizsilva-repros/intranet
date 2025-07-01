-- Inserir grupos padrão
INSERT INTO groups (name, description) VALUES
('admin', 'Administradores do sistema'),
('rh', 'Recursos Humanos'),
('financeiro', 'Departamento Financeiro'),
('vendas', 'Equipe de Vendas'),
('ti', 'Tecnologia da Informação'),
('suporte', 'Suporte Técnico'),
('user', 'Usuários Padrão')
ON CONFLICT (name) DO NOTHING;

-- Inserir categorias padrão
INSERT INTO categories (name, description, color) VALUES
('Sistemas Financeiros', 'ERP, Contabilidade e Faturamento', '#10B981'),
('Recursos Humanos', 'Gestão de Pessoas e Benefícios', '#3B82F6'),
('Vendas e CRM', 'Gestão Comercial e Relacionamento', '#8B5CF6'),
('Suporte Técnico', 'Helpdesk e Documentação', '#F59E0B')
ON CONFLICT DO NOTHING;

-- Inserir configurações padrão
INSERT INTO settings (company_name, primary_color, secondary_color, accent_color) VALUES
('Intranet Corporativa', '#3B82F6', '#10B981', '#8B5CF6')
ON CONFLICT DO NOTHING;

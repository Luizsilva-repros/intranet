-- Inserir usuário administrador padrão
INSERT INTO users (email, name, role, active, password_hash) VALUES
('admin@repros.com.br', 'Administrador', 'admin', true, 'hashed_admin_123'),
('luiz.silva@repros.com.br', 'Luiz Carlos', 'admin', true, 'hashed_luiz_123'),
('lucas.souza@repros.com.br', 'Lucas Souza', 'user', true, 'hashed_lucas_123')
ON CONFLICT (email) DO NOTHING;

-- Associar usuários aos grupos
INSERT INTO user_groups (user_id, group_id) 
SELECT u.id, g.id 
FROM users u, groups g 
WHERE (u.email = 'admin@repros.com.br' AND g.name = 'admin')
   OR (u.email = 'luiz.silva@repros.com.br' AND g.name = 'admin')
   OR (u.email = 'lucas.souza@repros.com.br' AND g.name = 'rh')
   OR (u.email = 'lucas.souza@repros.com.br' AND g.name = 'user')
ON CONFLICT DO NOTHING;

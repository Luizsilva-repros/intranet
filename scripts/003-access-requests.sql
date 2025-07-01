-- Tabela para solicitações de acesso
CREATE TABLE IF NOT EXISTS access_requests (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  processed_by INTEGER REFERENCES users(id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_access_requests_email ON access_requests(email);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);

-- RLS
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Qualquer um pode criar solicitação" ON access_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins podem ver todas solicitações" ON access_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM authorized_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND role = 'admin' 
      AND is_active = true
    )
  );

CREATE POLICY "Admins podem atualizar solicitações" ON access_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM authorized_users 
      WHERE email = auth.jwt() ->> 'email' 
      AND role = 'admin' 
      AND is_active = true
    )
  );

-- Função para aprovar automaticamente solicitação e criar usuário
CREATE OR REPLACE FUNCTION approve_access_request(request_id INTEGER, admin_email TEXT)
RETURNS VOID AS $$
DECLARE
  request_record access_requests%ROWTYPE;
  admin_id INTEGER;
BEGIN
  -- Buscar a solicitação
  SELECT * INTO request_record FROM access_requests WHERE id = request_id;
  
  -- Buscar ID do admin
  SELECT id INTO admin_id FROM authorized_users WHERE email = admin_email;
  
  -- Criar usuário autorizado
  INSERT INTO authorized_users (email, name, role, is_active)
  VALUES (request_record.email, request_record.name, 'user', true)
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    is_active = true;
  
  -- Atualizar status da solicitação
  UPDATE access_requests 
  SET status = 'approved', 
      processed_at = CURRENT_TIMESTAMP, 
      processed_by = admin_id
  WHERE id = request_id;
END;
$$ LANGUAGE plpgsql;

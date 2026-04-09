// src/config/maintenance.js
export const maintenanceConfig = {
  // Ativar/desativar manutenção
  enabled: false, // mude para false quando quiser liberar
  
  // Emails que podem acessar mesmo em manutenção
  whitelistEmails: [
    'devzunxbr@gmail.com', // seu email
  ],
  
  // IPs que podem acessar (opcional)
  whitelistIps: [
    // '127.0.0.1', // localhost
  ],
};
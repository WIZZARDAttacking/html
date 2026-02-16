// App object para evitar poluição do escopo global
const app = {
    // Configurações
    config: {
        credentials: {
            username: 'admin',
            password: '1234'
        },
        emailDomain: '@cmail.asia',
        emailLength: 12
    },

    // Inicialização
    init: function() {
        this.addEventListeners();
        this.checkSavedSession();
    },

    // Event Listeners
    addEventListeners: function() {
        // Enter key para login
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const loginBox = document.getElementById('loginBox');
                if (!loginBox.classList.contains('hidden')) {
                    this.login();
                }
            }
        });

        // Auto gerar email ao abrir
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.id === 'geradorBox' && 
                    !mutation.target.classList.contains('hidden')) {
                    this.gerarEmail();
                }
            });
        });

        observer.observe(document.getElementById('geradorBox'), {
            attributes: true,
            attributeFilter: ['class']
        });
    },

    // Função de Login
    login: function() {
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value.trim();
        
        // Validação
        if (!user || !pass) {
            this.showMessage('❌ Preencha todos os campos!', 'error');
            return;
        }

        // Verificação
        if(user === this.config.credentials.username && 
           pass === this.config.credentials.password) {
            
            // Login bem sucedido
            document.getElementById('loginBox').classList.add('hidden');
            document.getElementById('geradorBox').classList.remove('hidden');
            
            // Limpar campos
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            
            // Salvar sessão (opcional)
            sessionStorage.setItem('loggedIn', 'true');
            
            this.showMessage('✅ Login realizado com sucesso!', 'success');
            
        } else {
            this.showMessage('❌ Usuário ou senha incorretos!', 'error');
            this.shakeElement(document.getElementById('loginBox'));
        }
    },

    // Gerar Email
    gerarEmail: function() {
        const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let nome = '';
        
        for (let i = 0; i < this.config.emailLength; i++) {
            nome += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        
        const email = nome + this.config.emailDomain;
        document.getElementById('email').value = email;
        
        // Animação
        const emailInput = document.getElementById('email');
        emailInput.style.transform = 'scale(1.05)';
        setTimeout(() => {
            emailInput.style.transform = 'scale(1)';
        }, 200);
        
        this.showMessage('✨ Email gerado com sucesso!', 'success');
    },

    // Copiar Email
    copiarEmail: function() {
        const campo = document.getElementById('email');
        
        if (!campo.value) {
            this.showMessage('⚠️ Gere um email primeiro!', 'warning');
            return;
        }
        
        // Método moderno de cópia
        navigator.clipboard.writeText(campo.value).then(() => {
            this.showMessage('📋 Email copiado para clipboard!', 'success');
            
            // Feedback visual
            campo.style.backgroundColor = '#d4edda';
            setTimeout(() => {
                campo.style.backgroundColor = '#e8f0fe';
            }, 500);
            
        }).catch(err => {
            // Fallback para navegadores antigos
            campo.select();
            document.execCommand('copy');
            this.showMessage('📋 Email copiado!', 'success');
        });
    },

    // Verificar Email
    verificarEmail: function() {
        const email = document.getElementById('email').value;
        
        if (!email) {
            this.showMessage('⚠️ Gere um email primeiro!', 'warning');
            return;
        }
        
        // Abrir site de verificação
        window.open('https://temp-mail.asia/', '_blank');
        this.showMessage('🔍 Verificando email...', 'info');
    },

    // Sistema de mensagens
    showMessage: function(text, type = 'info') {
        // Remover mensagem anterior se existir
        const oldMsg = document.querySelector('.message-popup');
        if (oldMsg) oldMsg.remove();
        
        // Criar nova mensagem
        const msg = document.createElement('div');
        msg.className = `message-popup message-${type}`;
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 50px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideDown 0.3s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        `;
        
        // Cores por tipo
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        msg.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(msg);
        
        // Remover após 3 segundos
        setTimeout(() => {
            msg.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => msg.remove(), 300);
        }, 3000);
    },

    // Animação de shake
    shakeElement: function(element) {
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    },

    // Verificar sessão
    checkSavedSession: function() {
        if (sessionStorage.getItem('loggedIn') === 'true') {
            document.getElementById('loginBox').classList.add('hidden');
            document.getElementById('geradorBox').classList.remove('hidden');
            this.gerarEmail();
        }
    },

    // Logout
    logout: function() {
        sessionStorage.removeItem('loggedIn');
        document.getElementById('geradorBox').classList.add('hidden');
        document.getElementById('loginBox').classList.remove('hidden');
        this.showMessage('👋 Logout realizado!', 'info');
    }
};

// Adicionar animações CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => app.init());

// Exportar para uso global
window.app = app;
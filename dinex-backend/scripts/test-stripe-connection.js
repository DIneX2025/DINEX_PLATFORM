// test-stripe-connection.js
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testConnection() {
    console.log('--- Iniciando teste de conexão com a Stripe ---');
    try {
        // Tenta recuperar os detalhes da conta para validar a chave secreta
        const account = await stripe.accounts.retrieve();
        console.log('✅ Conexão estabelecida com sucesso!');
        console.log(`ID da Conta: ${account.id}`);
        console.log('Sua chave API está configurada corretamente.');
    } catch (error) {
        console.error('❌ Erro ao conectar com a Stripe:');
        console.error(`Mensagem: ${error.message}`);
        console.log('\nVerifique se a sua STRIPE_SECRET_KEY no arquivo .env está correta.');
    }
}

testConnection();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta atual (ou onde estão seus arquivos HTML, CSS, etc.)
app.use(express.static(path.join(__dirname)));

// Servir o arquivo HTML do formulário na rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Envia o arquivo index.html ao acessar "/"
});

// Endpoint para receber os dados do formulário
app.post('/formulario1', (req, res) => {
    const formData = req.body;

    // Lê o arquivo JSON existente
    fs.readFile('db1.json', 'utf8', (err, data) => {
        if (err) {
            console.log('Erro ao ler o arquivo:', err);
            res.status(500).send('Erro no servidor');
            return;
        }

        // Parseia o JSON existente
        const db = data ? JSON.parse(data) : [];

        // Adiciona os novos dados ao banco de dados (array)
        db.push({
            nome: formData.nome,
            codigo: formData.codigo,
            totalAlunos: formData.totalAlunos, // Certifique-se de que este campo esteja sendo enviado
            inicio: formData.inicio,
            fim: formData.fim,
            data: formData.data // Armazena a data também
        });

        // Salva os dados atualizados no arquivo
        fs.writeFile('db1.json', JSON.stringify(db, null, 2), (err) => {
            if (err) {
                console.log('Erro ao salvar o arquivo:', err);
                res.status(500).send('Erro no servidor');
                return;
            }

            res.send('Dados salvos com sucesso!');
        });
    });
});

// Endpoint para visualizar os registros
app.get('/ver-registros1', (req, res) => {
    fs.readFile('db1.json', 'utf8', (err, data) => {
        if (err) {
            console.log('Erro ao ler o arquivo:', err);
            res.status(500).send('Erro no servidor');
            return;
        }

        const registros = data ? JSON.parse(data) : [];
        let html = '<h2>Registros:</h2><ul>';

        registros.forEach(registro => {
            html += `<li>${registro.data}: ${registro.nome} (Código: ${registro.codigo}, Total de Alunos: ${registro.totalAlunos}, Início: ${registro.inicio}, Fim: ${registro.fim})</li>`;
        });

        html += '</ul>';
        res.send(html); // Retorna os registros formatados como HTML
    });
});

// Rota para receber os dados do formulário 2
app.post('/formulario2', (req, res) => {
    const formData = req.body;

    // Lê o arquivo JSON existente ou cria um novo se não existir
    fs.readFile('db2.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.log('Erro ao ler o arquivo:', err);
            res.status(500).send('Erro no servidor');
            return;
        }

        // Parseia o JSON existente ou cria um novo array
        const db = data ? JSON.parse(data) : [];

        // Adiciona os novos dados ao banco de dados (array)
        db.push({
            nome: formData.nome,
            email: formData.email,
        });

        // Salva os dados atualizados no arquivo
        fs.writeFile('db2.json', JSON.stringify(db, null, 2), (err) => {
            if (err) {
                console.log('Erro ao salvar o arquivo:', err);
                res.status(500).send('Erro no servidor');
                return;
            }

            res.send('Dados do usuário 2 salvos com sucesso!');
        });
    });
});

// Rota para visualizar os registros do formulário 2
app.get('/ver-registros2', (req, res) => {
    fs.readFile('db2.json', 'utf8', (err, data) => {
        if (err) {
            console.log('Erro ao ler o arquivo:', err);
            res.status(500).send('Erro no servidor');
            return;
        }

        const registros = data ? JSON.parse(data) : [];
        let html = '<h2>Registros:</h2><ul>';

        registros.forEach(registro => {
            html += `<li>${registro.nome} (Email: ${registro.email})</li>`;
        });

        html += '</ul>';
        res.send(html); // Retorna os registros formatados como HTML
    });
});


// Iniciar o servidor na porta 3000
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

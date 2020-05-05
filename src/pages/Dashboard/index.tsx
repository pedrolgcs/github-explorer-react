import React, { useState, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Container, Title, Form, Repositories, Error } from './styles';

interface Repository {
  id: string;
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [inputError, setInputError] = useState('');
  const [newRepo, setNewRepo] = useState('');

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite author/nome do repositório');
      return;
    }

    try {
      const { data: repository } = await api.get<Repository>(
        `/repos/${newRepo}`,
      );
      setRepositories([...repositories, repository]);
      setInputError('');
    } catch (err) {
      setInputError('Error ao buscar este reposiório');
    }
    setNewRepo('');
  }

  return (
    <Container>
      <img src={logoImg} alt="GitHub" />
      <Title>Explore repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          placeholder="Digite aqui"
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <a key={repository.id} href="teste">
            <img src={repository.owner.avatar_url} alt="Pedro H." />
            <div>
              <strong>{repository.owner.login}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repositories>
    </Container>
  );
};

export default Dashboard;

'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

import styles from './login.module.css';
import { Paths } from '@/constants';
import { useAuth } from '@/lib';


interface UsernameFormControls extends HTMLFormControlsCollection {
  name: HTMLInputElement;
}

interface UsernameFormElement extends HTMLFormElement {
  readonly elements: UsernameFormControls;
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (event: FormEvent<UsernameFormElement>) => {
    event.preventDefault();
    login(event.currentTarget.elements.name.value);
    router.push(Paths.chat);
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>💬</div>
        <h1 className={styles.title}>ChatApp</h1>
        <p className={styles.subtitle}>
          Enter your display name to start chatting in real-time
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            placeholder='Enter your name'
            type='text'
            required={true}
            name='name'
            id='name'
            autoComplete='off'
            autoFocus
          />
          <button type='submit' className={styles.button}>
            Start Chatting →
          </button>
        </form>
      </div>
    </main>
  );
}

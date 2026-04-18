'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

import styles from './login.module.css';
import { Paths } from '@/constants';
import { useAuth } from '@/lib';


interface FormElements extends HTMLFormControlsCollection {
  name : HTMLInputElement;
}

interface FormElements extends HTMLFormElement {
  readonly elements : FormElements;
}

export default function Home() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (event : FormElements<FormElements>) => {

    event.preventDefault();
    login(event.currentTarget.elements.name.value);
    router.push(Paths.chat);
    
  };

  return (

    <main className='{style.main}'>
      <h1>Welcome</h1>
      <form onSubmit={handleSubmit} className='{style.form'>
        <input
          placeholder='Username'
          type= 'text'
          required={true}
          name='name'
          id='name'
          autoComplete='off'
        />
        <button type='submit'>Login</button>
      </form>
    </main>
  );
}
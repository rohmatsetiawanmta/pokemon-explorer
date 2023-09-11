'use client';
import React, { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql } from '@apollo/client';
import { initFirebase } from '../../firebase/firebaseApp';

const query = gql`
  query Query {
    getAllPokemon {
      key
      num
      types {
        name
      }
      species
      formeLetter
    }
  }
`;

export default function Home() {
  initFirebase();
  const { data } = useSuspenseQuery(query);
  const pokemonData = data.getAllPokemon.filter(
    (pokemon) => pokemon.num > 0 && pokemon.num <= 905 && !pokemon.formeLetter && pokemon.key != 'sneaselhisui'
  );

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const listDataPerPage = [5, 10, 25, 50, 100];

  useEffect(() => {
    setMaxPage(Math.ceil(pokemonData.filter((pokemon) => pokemon.species.toLowerCase().includes(search.toLowerCase()))?.length / dataPerPage));
  }, [pokemonData, dataPerPage, search]);

  useEffect(() => {
    setPage(1);
  }, [dataPerPage]);

  return (
    <div className='container'>
      <div className='pokemonListHeader'>
        <h1>Pokemon List</h1>
        <div className='listNumberPerPage'>
          <div>Pokemon per page: </div>
          {listDataPerPage.map((key) => {
            return (
              <div key={key} className='pokemonPerPage'>
                <button className={`${dataPerPage == key ? 'focus' : ''}`} onClick={() => setDataPerPage(key)}>
                  {key}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className='searchBar'>
        <input type='text' value={search} placeholder='Search your Pokemon' onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className='cards'>
        {pokemonData
          .filter((pokemon) => pokemon.species.toLowerCase().includes(search.toLowerCase()))
          .slice(dataPerPage * (page - 1), dataPerPage * page)
          .map((pokemon) => {
            return (
              <div key={pokemon.key} className='card'>
                <div>#{pokemon.num}</div>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.num}.png`}
                  alt={pokemon.key}
                />
                <div>{pokemon.species.toUpperCase()}</div>
                <div className='types'>
                  {pokemon.types.map((type) => {
                    return (
                      <div key={type.name} className={`type ${type.name.toLowerCase()}`}>
                        {type.name}
                      </div>
                    );
                  })}
                </div>
                <div className='icons'>
                  <div className='icon'>
                    <a href={`./detail/${pokemon.num}`}>
                      <span className='material-symbols-outlined'>info</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className='pagination'>
        {page === 1 ? (
          <>
            <button className='disable'>
              <span className='material-symbols-outlined'>keyboard_double_arrow_left</span>
            </button>
            <button className='disable'>
              <span className='material-symbols-outlined'>keyboard_arrow_left</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setPage(1)}>
              <span className='material-symbols-outlined'>keyboard_double_arrow_left</span>
            </button>
            <button onClick={() => setPage(page - 1)}>
              <span className='material-symbols-outlined'>keyboard_arrow_left</span>
            </button>
          </>
        )}
        <div>
          {page}/{maxPage}
        </div>
        {page === maxPage ? (
          <>
            <button className='disable'>
              <span className='material-symbols-outlined'>keyboard_arrow_right</span>
            </button>
            <button className='disable'>
              <span className='material-symbols-outlined'>keyboard_double_arrow_right</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setPage(page + 1)}>
              <span className='material-symbols-outlined'>keyboard_arrow_right</span>
            </button>
            <button onClick={() => setPage(maxPage)}>
              <span className='material-symbols-outlined'>keyboard_double_arrow_right</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

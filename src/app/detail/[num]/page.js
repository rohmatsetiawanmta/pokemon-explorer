'use client';
import React, { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { gql } from '@apollo/client';

const query = gql`
  query GetPokemonByDexNumber($number: Int!) {
    getPokemonByDexNumber(number: $number) {
      key
      num
      types {
        name
      }
      species
      height
      weight
      abilities {
        first {
          key
          name
          shortDesc
        }
        hidden {
          key
          name
          shortDesc
        }
        second {
          key
          name
          shortDesc
        }
        special {
          key
          name
          shortDesc
        }
      }
      catchRate {
        base
        percentageWithOrdinaryPokeballAtFullHealth
      }
      baseStats {
        attack
        defense
        hp
        specialattack
        specialdefense
        speed
      }
      gender {
        female
        male
      }
    }
  }
`;

export default function Detail({ params }) {
  const [favorite, setFavorite] = useState([]);

  useEffect(() => {
    setFavorite(JSON.parse(localStorage.getItem('favorite')));
  }, []);

  const handleFavorite = (key) => {
    let index = favorite.indexOf(key);
    if (index === -1) {
      setFavorite([...favorite, key]);
      localStorage.setItem('favorite', JSON.stringify([...favorite, key]));
    } else {
      const updatedFavorite = [...favorite];
      updatedFavorite.splice(index, 1);
      setFavorite(updatedFavorite);
      localStorage.setItem('favorite', JSON.stringify(updatedFavorite));
    }
  };

  const properString = (input) => {
    return input
      .toLowerCase()
      .split(' ')
      .map((key) => {
        return key.charAt(0).toUpperCase() + input.slice(1);
      });
  };

  const number = Number(params.num);
  let prevNumber = number - 1;
  if (prevNumber === 0) {
    prevNumber = 905;
  }
  let nextNumber = number + 1;
  if (nextNumber === 906) {
    nextNumber = 1;
  }
  const pokemonData = useSuspenseQuery(query, { variables: { number } }).data.getPokemonByDexNumber;
  const prevPokemonData = useSuspenseQuery(query, { variables: { number: prevNumber } }).data.getPokemonByDexNumber;
  const nextPokemonData = useSuspenseQuery(query, { variables: { number: nextNumber } }).data.getPokemonByDexNumber;

  return (
    <div className='container'>
      <h1>Pokemon #{pokemonData.num}</h1>
      <div className='detailCard'>
        <div className='pokemonImage'>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.num}.png`}
            alt={pokemonData.key}
          />
          <div className='icon' onClick={(e) => handleFavorite(pokemonData.key)}>
            {favorite?.indexOf(pokemonData.key) === -1 ? (
              <div className='iconFavorite'>
                <span className='material-symbols-outlined'>favorite</span>
                <div>Favorite</div>
              </div>
            ) : (
              <div className='iconFavorite'>
                <span className='material-symbols-outlined filled'>favorite</span>
                <div>Favorited</div>
              </div>
            )}
          </div>
        </div>
        <div className='pokemonDetails'>
          <div className='pokemonDetail detailLight'>
            <div className='detailName'>Species Name</div>
            <div className='detail'>{properString(pokemonData.species)}</div>
          </div>
          <div className='pokemonDetail'>
            <div className='detailName'>Type</div>
            <div className='detailType'>
              {pokemonData.types.map((type) => {
                return (
                  <div key={type.name} className={`type ${type.name.toLowerCase()}`}>
                    {type.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className='pokemonDetail detailLight'>
            <div className='detailName'>Height</div>
            <div className='detail'>{pokemonData.height} m</div>
          </div>
          <div className='pokemonDetail'>
            <div className='detailName'>Weight</div>
            <div className='detail'>{pokemonData.weight} gram</div>
          </div>
          <div className='pokemonDetail detailLight'>
            <div className='detailName'>Abilities</div>
            <div className='detailAbilities'>
              {Object.keys(pokemonData.abilities)
                .slice(1)
                .map((key) => {
                  return (
                    <>
                      {pokemonData.abilities[key]?.name ? (
                        <div className='detailAbility' key={key}>
                          <div className='abilityType'>{properString(key)}</div>
                          <div className='abilityName'>{pokemonData.abilities[key]?.name}</div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  );
                })}
            </div>
          </div>
        </div>
        <div className='pokemonStats'>
          <div className='pokemonStat statLight'>
            <div className='statName'>Base Stats</div>
            <div className='baseStats'>
              <div className='baseStat'>
                <div className='baseStatName'>Attack</div>
                <div className='baseStatNum'>{pokemonData.baseStats.attack}</div>
              </div>
              <div className='baseStat'>
                <div className='baseStatName'>Defense</div>
                <div className='baseStatNum'>{pokemonData.baseStats.defense}</div>
              </div>
              <div className='baseStat'>
                <div className='baseStatName'>HP</div>
                <div className='baseStatNum'>{pokemonData.baseStats.hp}</div>
              </div>
              <div className='baseStat'>
                <div className='baseStatName'>Sp. Attack</div>
                <div className='baseStatNum'>{pokemonData.baseStats.specialattack}</div>
              </div>
              <div className='baseStat'>
                <div className='baseStatName'>Sp. Defense</div>
                <div className='baseStatNum'>{pokemonData.baseStats.specialdefense}</div>
              </div>
              <div className='baseStat'>
                <div className='baseStatName'>Speed</div>
                <div className='baseStatNum'>{pokemonData.baseStats.speed}</div>
              </div>
            </div>
          </div>
          <div className='pokemonStat'>
            <div className='statName'>Gender</div>
            {parseFloat(pokemonData.gender.male) + parseFloat(pokemonData.gender.female) === 100 ? (
              <div className='statGender'>
                <div className='statGenderBar'>
                  <div>
                    <span className='material-symbols-outlined'>male</span>
                  </div>
                  <div className='genderBar'>
                    <div className='genderBarMale' style={{ width: pokemonData.gender.male }}>
                      .
                    </div>
                    <div className='genderBarFemale' style={{ width: pokemonData.gender.female }}>
                      .
                    </div>
                  </div>
                  <div>
                    <span className='material-symbols-outlined'>female</span>
                  </div>
                </div>
                <div className='statGenderDescription'>
                  <div>{pokemonData.gender.male} Male</div>
                  <div>{pokemonData.gender.female} Female</div>
                </div>
              </div>
            ) : (
              <div className='noGender'>Gender Unknown</div>
            )}
          </div>
          <div className='pokemonStat statLight'>
            <div className='statName'>Catch Rate</div>
            <div>
              {pokemonData.catchRate.base} ({pokemonData.catchRate.percentageWithOrdinaryPokeballAtFullHealth})
            </div>
          </div>
        </div>
      </div>
      <div className='nextPrevPokemon'>
        <div className='prevPokemon'>
          <a href={`./${prevPokemonData.num}`}>
            <div>
              <span className='material-symbols-outlined'>arrow_left_alt</span>
            </div>
            <p className='nextPrevPokemonNum'>#{prevPokemonData.num}</p>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${prevPokemonData.num}.png`}
              alt={prevPokemonData.key}
            />
            <div>{properString(prevPokemonData.species)}</div>
          </a>
        </div>
        <div className='nextPokemon'>
          <a href={`./${nextPokemonData.num}`}>
            <div>
              <span className='material-symbols-outlined'>arrow_right_alt</span>
            </div>
            <p className='nextPrevPokemonNum'>#{nextPokemonData.num}</p>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${nextPokemonData.num}.png`}
              alt={nextPokemonData.key}
            />
            <div>{properString(nextPokemonData.species)}</div>
          </a>
        </div>
      </div>
    </div>
  );
}

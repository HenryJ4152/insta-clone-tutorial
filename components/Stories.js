import { faker } from '@faker-js/faker';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Story from './Story'

function Stories() {

  const [suggestions, setSuggestions] = useState([])
  const { data: session } = useSession()

  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      avatar: faker.image.avatar(),
      birthday: faker.date.birthdate(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      lastName: faker.name.lastName(),
      sex: faker.name.sexType(),
      id: i,
    }))

    setSuggestions(suggestions)
  }, [])



  return (
    <div className='flex space-x-2 p-6 bg-white mt-8 border-gray-200 border overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300'>
      {/* Story */}

      {session &&
        <Story
          key={session.user.uid}
          img={session.user.image}
          username={session.user.username}
        />
      }

      {suggestions.map(profile => (
        <Story
          key={profile.id}
          img={profile.avatar}
          username={profile.username}
        />
      ))}
    </div>
  )
}

export default Stories
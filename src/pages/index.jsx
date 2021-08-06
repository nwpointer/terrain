import useStore from '@/helpers/store'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Player = dynamic(() => import('@/components/canvas/Player'), {
  ssr: false,
})
const Terrain = dynamic(() => import('@/components/canvas/Terrain'), {
  ssr: false,
})

const Page = ({ title }) => {
  useStore.setState({ title })
  return (
    <>
      <Player r3f />
      <Terrain r3f />

      {/* Step 5 - delete Instructions components */}
    </>
  )
}

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Index',
    },
  }
}

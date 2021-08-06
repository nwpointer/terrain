import useStore from '@/helpers/store'
import dynamic from 'next/dynamic'

const Grass = dynamic(() => import('@/components/canvas/Grass'), {
  ssr: false,
})

const Page = ({ title }) => {
  useStore.setState({ title })
  return (
    <>
      <Grass r3f />
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

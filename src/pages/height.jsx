import useStore from '@/helpers/store'
import dynamic from 'next/dynamic'

const Height = dynamic(() => import('@/components/canvas/HeightField'), {
  ssr: false,
})

const Page = ({ title }) => {
  useStore.setState({ title })
  return (
    <>
      <Height r3f />
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

import useStore from '@/helpers/store'
import dynamic from 'next/dynamic'

const MaterialDemo = dynamic(() => import('@/components/canvas/MaterialDemo'), {
  ssr: false,
})

const Page = ({ title }) => {
  useStore.setState({ title })
  return (
    <>
      <MaterialDemo r3f />
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

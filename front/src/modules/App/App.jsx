import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'


import Navigation from '../../pages/Navigation'
import LoaderComponent from "../../shared/components/LoaderComponent/Loader"
import { selectAuth, selectToken } from "../../redux/auth/auth.selectors"
import {getCurrent} from "../../redux/auth/auth.thunks"

import "../../shared/styles/styles.css"

function App() {
  const token = useSelector(selectToken);
  const { loading } = useSelector(selectAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(getCurrent());
    }
  }, [dispatch, token])
  
    if (token && loading) {
    return <LoaderComponent loading={loading}/>;
  }

  return (
    <>
      <Navigation />
    </>

  )
}

export default App

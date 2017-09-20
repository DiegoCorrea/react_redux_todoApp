import axios from 'axios'

const URL = 'http://localhost:3000/api/todos'

export const changeDescription = (event) => ({
  type: 'DESCRIPTION_CHANGED',
  payload: event.target.value
})

export const search = () => {
  return (dispatch, getState) => {
    const description = getState().todo.description
    const search = description ? `&description__regex=/${description}/` : ''
    axios.get(`${URL}?sort=-createdAt${search}`)
      .then(resp => dispatch({ type: 'TODO_SEARCHED', payload: resp.data }))
  }
}

export const add = (description) => {
  return dispatch => {
    axios.post(URL, {description})
      .then(resp => dispatch(clear()))
      .then(resp => dispatch(search()))
  }
}
export const markedAsDone = todo => {
  return dispatch => {
    axios.put(`${URL}/${todo._id}`, {...todo, done:true})
      .then(resp => dispatch({type: 'TODO_MARKED_AS_DONE', payload: resp.data}))
      .then(resp => dispatch(search()))
  }
}
export const handleRemove = (todo) => {
  return dispatch => {
    axios.delete(`${URL}/${todo._id}`)
      .then(resp => dispatch({ type: 'TODO_DELETE', payload: resp.data}))
      .then(resp => dispatch(search()))
  }
}
export const markAsPending = (todo) => {
  return dispatch => {
    axios.put(`${URL}/${todo._id}`, {...todo, done:false})
      .then(resp => dispatch({ type: 'TODO_MARKED_AS_PENDING', payload: resp.data}))
      .then(resp => dispatch(search()))
  }
}
export const clear = () => {
  return [{ type: 'TODO_CLEAR' }, search()]
}

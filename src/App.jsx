import './App.css'
import { RecoilRoot } from 'recoil'
import DocumentEditor from './DocumentEditor'

function App() {
 return (
    <RecoilRoot>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <DocumentEditor />
      </div>
      
    </RecoilRoot>
  )
}

export default App

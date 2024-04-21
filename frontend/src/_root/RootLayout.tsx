import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div>
      <Outlet /> {/* This will render the matched child route */}
    </div>
  )
}

export default RootLayout;

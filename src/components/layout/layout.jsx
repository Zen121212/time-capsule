import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";

function Layout({ children }) {
  return (
    <>
      <Header />
      <Navigation />
      <main>{children}</main>
    </>
  );
}

export default Layout;

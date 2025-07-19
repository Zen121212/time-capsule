import Header from "./Header/Header";
import Navigation from "./Navigation/Navigation";

function Layout({ children }) {
  return (
    <>
      {/* <Navigation /> */}
      <Header />
      <main>{children}</main>
    </>
  );
}

export default Layout;

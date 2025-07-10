import "./App.css";
import { FaArrowLeft } from "react-icons/fa";
// import { useState } from "react";
import Button from "./components/common/Button/Button";
import Modal from "./components/common/Modal/Modal";
import Layout from "./components/layout/layout";
import CapsuleCard from "./components/capsule/CapsuleCard/CapsuleCard";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  // const handleClick = () => {
  //   alert("Button clicked!");
  // };
  // const [open, setOpen] = useState(false);
  return (
    <>
      {/* <Button label="Create Capsule" onClick={handleClick} />
      <Button label="Save" variant="primary" />
      <Button label="Delete" variant="danger" />
      <Button
        label="Cancel"
        variant="secondary"
        outline
        iconLeft={<FaArrowLeft />}
      />
      <Button label="Small" variant="primary" size="small" />
      <Button label="Open Modal" onClick={() => setOpen(true)} />

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h2>Hello from Modal!</h2>
        <p>This is modal content.</p>
        <Button label="Close" onClick={() => setOpen(false)} />
      </Modal>

      <Layout>
        <section>
          <h2>Welcome to my website</h2>
          <p>This is some content inside the layout.</p>
        </section>
      </Layout>
      <CapsuleCard /> */}
      <Dashboard />
    </>
  );
}

export default App;


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BirthdayForm from "@/components/BirthdayForm";
import Balloons from "@/components/Balloons";

export default function AddBirthday() {
  return (
    <div className="min-h-screen bg-background page-transition pb-24">
      <Header />
      <Balloons />
      
      <main className="container-padding">
        <div className="max-w-2xl mx-auto">
          <BirthdayForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}

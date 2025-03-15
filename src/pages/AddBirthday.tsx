
import Header from "@/components/Header";
import BirthdayForm from "@/components/BirthdayForm";

export default function AddBirthday() {
  return (
    <div className="min-h-screen bg-background page-transition">
      <Header />
      
      <main className="container-padding">
        <div className="max-w-2xl mx-auto">
          <BirthdayForm />
        </div>
      </main>
    </div>
  );
}

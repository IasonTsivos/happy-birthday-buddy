
import Header from "@/components/Header";
import BirthdayForm from "@/components/BirthdayForm";

export default function AddBirthday() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 page-transition">
      <Header />
      
      <main className="container-padding">
        <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-subtle border border-white">
          <BirthdayForm />
        </div>
      </main>
    </div>
  );
}

import { useEffect } from "react"; // 1. Tambahkan import useEffect
import { CustomFormField, Form } from "../../components/form";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { loginSchema } from "../../services/auth/form";
import { postLogin } from "../../services/auth/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../hooks/useToken";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginPage = () => {
  const navigate = useNavigate();
  const { changeToken } = useToken();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      provider: "b", // Default pilihan ke 'b' (SQLite Hono) atau 'a' (Express)
    },
    mode: "onChange",
  });

  // Bersihkan token sisa saat pengguna masuk ke halaman login
  useEffect(() => {
  }, []);

const onSubmit = async (data) => {
  try {
    const result = await postLogin(data);
    
    // CETAK ISI HASIL RESPONS DI CONSOLE
    console.log("[DEBUG RESPONS LOGIN]:", result);

    // Ambil token dengan memeriksa semua kemungkinan tempat
    const token = 
      result?.token || 
      result?.data?.token || 
      result?.data?.data?.token;

    console.log("[DEBUG TOKEN]:", token);

    if (!token) {
      toast.error("Token tidak ditemukan pada respons server.");
      return;
    }

    // Simpan ke localStorage
    const selectedProvider = (data.provider || "b").toUpperCase();
    localStorage.setItem("token", token);
    localStorage.setItem("auth_source", selectedProvider);
    localStorage.setItem("username", data.username);

    if (changeToken) {
      changeToken(token);
    }

    toast.success("Login berhasil!");
    navigate("/admin", { replace: true });

  } catch (error) {
    console.error("[LOGIN ERROR]:", error);
    toast.error("Gagal melakukan login.");
  }
};

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          Manage Content Website SDA
        </div>

        <Form {...form}>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Pilihan Layanan / Provider */}
<CustomFormField
  control={form.control}
  name="provider"
  label="Pilih Layanan / Database"
>
  {(field) => (
    <div className="flex flex-col gap-2 mt-1">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="provider"
          value="b"
          checked={field.value === "b" || !field.value} // Default b
          onChange={() => field.onChange("b")}
        />
        <span>Baru (sda.bbwssumatera8.id)</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="provider"
          value="a"
          checked={field.value === "a"}
          onChange={() => field.onChange("a")}
        />
        <span>Warisan (sda.pu.go.id)</span>
      </label>
    </div>
  )}
</CustomFormField>

            {/* Input Username */}
            <CustomFormField
              control={form.control}
              name="username"
              label="Username"
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="Input username"
                  type="text"
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                />
              )}
            </CustomFormField>

            {/* Input Password */}
            <CustomFormField
              control={form.control}
              name="password"
              label="Password"
            >
              {(field) => (
                <Input
                  {...field}
                  placeholder="Input Password"
                  type="password"
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                />
              )}
            </CustomFormField>

            <Button
              type="submit"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              className="bg-indigo hover:bg-indigo mt-2"
            >
              {isSubmitting ? "Memproses..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
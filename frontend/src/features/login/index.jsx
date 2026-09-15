import { useEffect } from "react";
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
      provider: "b", // Default dikunci ke 'b' (SQLite Hono)
    },
    mode: "onChange",
  });

  // Bersihkan token sisa saat pengguna masuk ke halaman login
  useEffect(() => {
    // Logika pembersihan token jika diperlukan
  }, []);

  const onSubmit = async (data) => {
    try {
      // Pastikan provider selalu bernilai 'b'
      const payload = {
        ...data,
        provider: "b",
      };

      const result = await postLogin(payload);
      
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
      const selectedProvider = "B";
      localStorage.setItem("token", token);
      localStorage.setItem("auth_source", selectedProvider);
      localStorage.setItem("username", payload.username);

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
        <div className="flex justify-center mb-6 font-semibold text-gray-700">
          Manage Content Website SDA
        </div>

        <Form {...form}>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Field Hidden Provider (Default 'b') */}
            <div className="hidden">
              <CustomFormField
                control={form.control}
                name="provider"
                label="Provider"
              >
                {(field) => (
                  <input
                    type="hidden"
                    {...field}
                    value="b"
                  />
                )}
              </CustomFormField>
            </div>

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
export default function RegisterPage() {
  return <div className="">
    <form className="flex flex-col gap-4 justify-center items-center">
      <label htmlFor="email">Email</label>
      <input type="email" name="email" id="email" />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" id="password" />
      <button type="submit">Register</button>
    </form>
  </div>;
}

function home() {
  console.log(process.env.POSTGRES_PASSWORD)
  return (
    <h1>
      Não pare, as vezes a sua benção pode estar mais perto do que imagina
    </h1>
  );
}

export default home;

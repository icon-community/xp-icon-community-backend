declare module 'rqst' {
  const rqst: (
    path: string,
    data: any,
    hostname: string,
    useHttps: boolean,
    port: string | false,
  ) => Promise<any>; // Replace `any` with the correct type if you know it
  export default rqst;
}

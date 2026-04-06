export const api = {
  get: async (url: string) => {
    const res = await fetch(url);
    return res.json();
  },
  post: async (url: string, data: any) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
};

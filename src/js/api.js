import axios from 'axios';

export async function serviceGallery(q, page, per_page) {
  const URL = 'https://pixabay.com/api';
  const API_KEY = '41025952-5676fffa14718ed61db05f4ce';
  const params = new URLSearchParams({
    key: API_KEY,
    per_page,
    page,
    q: q,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const response = await axios.get(`${URL}/?${params}`);
  return response.data;
}

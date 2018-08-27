import _ from "lodash";
import{
  images,
}from './ImagesPath';

export const contains = ({name}, query) => {
  if (name.toLowerCase().includes(query)) {
    return true;
  }
  return false;
};

export const getImages = (limit = 20, query = "") => {
  return new Promise((resolve, reject) => {
    if (query.length === 0) {
      resolve(_.take(images, limit));
    } else {
      const formattedQuery = query.toLowerCase();
      const results = _.filter(images, image => {
        return contains(image, formattedQuery);
      });
      resolve(_.take(results, limit));
    }
  });
};

export default getImages;

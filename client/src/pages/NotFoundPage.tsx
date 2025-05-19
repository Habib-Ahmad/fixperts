const NotFoundPage = () => {
  return (
    <div className="pb-20">
      <img
        src="https://production-next-images-cdn.thumbtack.com/i/358286049525104654/width/320/aspect/1-1.png"
        alt="Not Found"
        className="mx-auto"
      />
      <h1 className="text-center text-2xl font-bold mt-4">Page Not Found</h1>

      <p className="text-center text-gray-600 mt-2">
        Sorry, the page you are looking for does not exist.
        <br />
        You can go back to the{' '}
        <a href="/" className="text-blue-500">
          home page
        </a>
        .
      </p>
    </div>
  );
};

export default NotFoundPage;

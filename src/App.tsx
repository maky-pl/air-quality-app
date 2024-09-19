import Map from './components/Map';

const App: React.FC = () => {

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-6">
      <div className="w-full max-w-md">
      </div>

      <div className="w-full">
        {/* Map component that receives radius as a prop */}
        <Map radius={0} />
      </div>
    </div>
  );
};

export default App;

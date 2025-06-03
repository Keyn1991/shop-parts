// import React, { useState } from "react";
//
// import { Part } from "../services/partsService";
// import {PartForm} from "../components/PartForm.tsx";
// import {PartsList} from "../components/PartList.tsx";
//
// const PartsPage: React.FC = () => {
//     const [selectedPart, setSelectedPart] = useState<Part | null>(null);
//
//     return (
//         <div>
//             <h1>Car Parts</h1>
//             <PartForm selectedPart={selectedPart} onRefresh={() => window.location.reload()} onClear={() => setSelectedPart(null)} />
//             <PartsList onEdit={(part) => setSelectedPart(part)} />
//         </div>
//     );
// };
//
// export default PartsPage;

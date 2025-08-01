import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './ModalVerDetallesRegistro.css';
import TextFieldReadOnlyUno from '../../TextField/TextFieldReadOnlyUno/TextFieldReadOnlyUno';
import { cambiarFormatoHoraFecha, formatoLegibleDesdeHoraString } from '../../../utils/funciones';
import { idSentidoVisitaEntrada } from '../../../utils/constantes';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  pt: 4,
};

const ModalVerDetallesRegistros = ({ open, onClose, visitaSeleccionada }) => {

    return (
        <Modal open={open} onClose={onClose}>
        <Box id="ContainerModalVerDetallesRegistro" sx={style}>
            <Box id="HeaderModalVerDetallesRegistro">
                <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: "black",
                }}
                >
                <CloseIcon />
                </IconButton>
            </Box>
            <Box id="CuerpoModalVerDetallesRegistro">

                <Box className="DosItemsCuerpoModalVerDetallesRegistro">
                    <TextFieldReadOnlyUno
                        label={"Nombre"}
                        value={`${visitaSeleccionada?.person?.names || "Sin datos"} ${visitaSeleccionada?.person?.lastNames || ""}`}
                    />

                    <TextFieldReadOnlyUno
                        label={"Rut/Pasaporte"}
                        value={`${visitaSeleccionada?.person?.identificationNumber || "Sin datos"}`}
                    />
                </Box>
                
                <Box className="DosItemsCuerpoModalVerDetallesRegistro">
                    <TextFieldReadOnlyUno
                        label={"Destino"}
                        value={`${visitaSeleccionada?.zone?.name || "Sin datos"} - Departamento ${visitaSeleccionada?.apartment?.name || ""}`}
                    />

                    <TextFieldReadOnlyUno
                        label={"Sentido"}
                        value={`${visitaSeleccionada?.direction?.visitDirection || "Sin datos"}`}
                    /> 
                </Box>      

                <Box className="DosItemsCuerpoModalVerDetallesRegistro">
                    <TextFieldReadOnlyUno
                        label={"Fecha"}
                        value={`${cambiarFormatoHoraFecha(visitaSeleccionada?.entryDate) || "Sin datos"}`}
                    />

                    <TextFieldReadOnlyUno
                        label={"Tipo de Visita"}
                        value={`${visitaSeleccionada?.visitType?.name || "Sin datos"}`}
                    /> 
                </Box>

                <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <TextFieldReadOnlyUno
                        label={"¿Incluye vehículo?"}
                        width='50%'
                        value={(visitaSeleccionada?.vehicleIncluded != null  && visitaSeleccionada?.vehicleIncluded != undefined) ? (visitaSeleccionada?.vehicleIncluded ? "Sí" : "No") : "Sin datos"}
                    />
                </Box>

                {visitaSeleccionada?.vehicleIncluded && (
                    <Box className="DosItemsCuerpoModalVerDetallesRegistro">
                        <TextFieldReadOnlyUno
                            label={"Patente vehículo"}
                            value={`${visitaSeleccionada?.licensePlate || "Sin datos"}`}
                        />

                        <TextFieldReadOnlyUno
                            label={"Estacionamiento"}
                            value={`${visitaSeleccionada?.parkingSpot?.name || "Sin datos"}`}
                        />
                    </Box>
                )}

                {visitaSeleccionada?.vehicleIncluded && visitaSeleccionada?.direction?.id === idSentidoVisitaEntrada &&(
                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <TextFieldReadOnlyUno
                            label={"Tiempo de uso autorizado para el estacionamiento"}
                            value={`${formatoLegibleDesdeHoraString(visitaSeleccionada?.authorizedTime) || "Sin datos"}`}
                            width='70%'
                        />
                    </Box>
                )

                }
            </Box>
        </Box>
        </Modal>
    );
};

export default ModalVerDetallesRegistros;
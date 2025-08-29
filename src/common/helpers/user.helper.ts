import { User } from '../../users/database/users.entity';
import { UserRole } from '../../users/database/users.entity';
export function formatUserResponse(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  };
}

export function formatUsersResponse(users: User[]) {
  // Filtramos solo aquellos usuarios que tienen los roles "carpintero" o "encargado_ventas"
  const filteredUsers = users.filter(user => 
    //user.role === UserRole.CARPINTERO || user.role === UserRole.ENCARGADO
    user.role === UserRole.CARPINTERO
  );
  return filteredUsers.map(user => formatUserResponse(user));
}

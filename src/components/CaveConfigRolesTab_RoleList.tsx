import { IconButton } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { CaveRole, CreateCaveRoleRequest } from '../api/CaveServiceApi';
import { useCave } from './CaveProvider';
import { DndContext, closestCenter, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';

function CaveConfigRolesTab_RoleList({ createCaveRole, Roles, handleRoleSelection, selectedRole, markRoleAsUpdated }: 
    { createCaveRole: (request: CreateCaveRoleRequest) => void, Roles: CaveRole[], handleRoleSelection: (role: CaveRole) => void, selectedRole: CaveRole | null, markRoleAsUpdated: (role: CaveRole[]) => void }) {
    const defaultRolePermissions = 961;
    const { selectedCaveBaseInfo } = useCave();

    const roleInputNameRef = useRef<HTMLInputElement>(null);

    const createRole = () => {
        const request: CreateCaveRoleRequest = {
            caveId: selectedCaveBaseInfo?.caveId || '',
            name: roleInputNameRef.current?.value || '',
            permissions: defaultRolePermissions
        }

        createCaveRole(request);
    }

    const [sRoles, setSRoles] = useState<CaveRole[]>(Roles)

    useEffect(() => {
        setSRoles(Roles)
    }, [Roles])

    const [originalPosition, setOriginalPosition] = useState<number | null>(null);
    const [moveHistory, setMoveHistory] = useState<{ roleId: string, from: number, to: number }[]>([]);


    const handleDragStart = (event: DragStartEvent) => {
        const roleId = event.active.id;
        const startPosition = sRoles.findIndex(role => role.id === roleId);
        setOriginalPosition(startPosition);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            setOriginalPosition(null);
            return;
        }

        const oldIndex = originalPosition;
        const newIndex = sRoles.findIndex(item => item.id === over.id);

        if (oldIndex !== null && oldIndex !== newIndex) {
            setMoveHistory(prevHistory => [
                ...prevHistory,
                { roleId: active.id as string, from: oldIndex, to: newIndex }
            ]);
        }

        const reorderedRoles = arrayMove(sRoles, oldIndex!, newIndex);

        const updatedRoles = reorderedRoles.map((role, index) => ({
            ...role,
            position: index, 
        }));

        setSRoles(updatedRoles);
        setOriginalPosition(null);
    };

    const getMinMaxOverallPositionValue = () => {
        if (moveHistory.length === 0) return null;
    
        const fromPositions = moveHistory.map(item => item.from);
        const toPositions = moveHistory.map(item => item.to);
    
        return {min: Math.min(...fromPositions, ...toPositions), max: Math.max(...fromPositions, ...toPositions)};
    };

    useEffect(() => {
        const minMaxOverallPositionValue = getMinMaxOverallPositionValue();

        if (minMaxOverallPositionValue === null) return;

        const rolesToBeUpdated = sRoles.filter(role => role.position <= minMaxOverallPositionValue.max && role.position >= minMaxOverallPositionValue.min);

        console.log('rolesToBeUpdated', rolesToBeUpdated);

        markRoleAsUpdated(rolesToBeUpdated);

        setMoveHistory([]);
        
    }, [moveHistory]);

    return (
        <div className='self-start flex flex-col gap-3'>
            <div>
                <div className='flex items-center gap-2 bg-primary-100 rounded-lg'>
                    <input type="text" ref={roleInputNameRef} placeholder='Role Name' className='outline-none bg-primary-100 rounded-lg p-2 w-full' />
                    <IconButton onClick={createRole}>
                        <AddIcon className='text-secondary-100' />
                    </IconButton>
                </div>
            </div>
            <div>
                {
                    sRoles && (
                        <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <SortableContext items={sRoles} strategy={verticalListSortingStrategy}>
                                <div>
                                    {sRoles.sort(((a,b) => a.position - b.position)).map(role => (
                                        <SortableItem key={role.id} id={role.id} role={role} selectedRoleId={selectedRole?.id} handleRoleSelection={handleRoleSelection} />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )
                }
            </div>
        </div>
    )
}


function SortableItem({ id, role, selectedRoleId, handleRoleSelection }: { id: string; role: CaveRole, selectedRoleId: string | undefined, handleRoleSelection: (role: CaveRole) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const handleClick = () => {
        handleRoleSelection(role);
    };

    const style: React.CSSProperties = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        padding: '5px',
        margin: '5px 0',
        borderRadius: '10px',
        cursor: 'grab',
        maxWidth: '100%',
        boxSizing: 'border-box',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onMouseDown={handleClick}
            className={`${selectedRoleId === role.id ? "bg-secondary-300" : "bg-primary-100"} text-center`}
            {...attributes}
            {...listeners}
        >
            {role.name}
        </div>
    );
}

export default CaveConfigRolesTab_RoleList
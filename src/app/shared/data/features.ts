import { computed } from '@angular/core';
import {
  withState,
  withMethods,
  patchState,
  withComputed,
  signalStoreFeature,
  type,
} from '@ngrx/signals';
import { EntityId, EntityState } from '@ngrx/signals/entities';

export type SelectedEntityState = { selectedEntityId: EntityId | null };

export function withSelectedEntity<Entity>() {
  return signalStoreFeature(
    withState<EntityState<Entity> & SelectedEntityState>({
      ...type<EntityState<Entity>>(),
      selectedEntityId: null,
    }),

    withComputed(({ entityMap, selectedEntityId }) => ({
      selectedEntity: computed(() => {
        const selectedId = selectedEntityId();
        const map = entityMap();

        return selectedId ? map[selectedId] : null;
      }),
    })),
    withMethods((store) => ({
      setSelectedEntityId: (selectedEntityId: EntityId | null) => {
        patchState(store, { selectedEntityId });
      },
    }))
  );
}

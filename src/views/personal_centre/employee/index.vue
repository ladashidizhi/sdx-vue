<template>
  <ContainerCell>
    <a-tabs position="left">
      <a-tab-pane key="1" :destroy-on-hide="true">
        <template #title>
          <icon-calendar />人员管理
        </template>
        <OfficerCell />
      </a-tab-pane>
      <a-tab-pane key="2" :destroy-on-hide="true">
        <template #title>
          <icon-clock-circle />角色管理
        </template>
        <CompetenceCell />
      </a-tab-pane>
      <a-tab-pane key="3" :destroy-on-hide="true">
        <template #title>
          <icon-menu />菜单管理
        </template>
        <MenuCell />
      </a-tab-pane>
    </a-tabs>
  </ContainerCell>
</template>
<script>
import ContainerCell from "@/views/personal_centre/components/ContainerCell.vue";
import OfficerCell from "@/views/personal_centre/components/OfficerCell.vue";
import CompetenceCell from "@/views/personal_centre/components/CompetenceCell.vue";
import MenuCell from "@/views/personal_centre/components/MenuCell.vue";
export default {
  components: { ContainerCell, OfficerCell, CompetenceCell, MenuCell },
};
</script>

import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { compose } from 'ramda';
import graphql from 'babel-plugin-relay/macro';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { SettingsInputComponent } from '@material-ui/icons';
import { QueryRenderer } from '../../../relay/environment';
import inject18n from '../../../components/i18n';

const styles = () => ({
  paper: {
    minHeight: 300,
    height: '100%',
    margin: '10px 0 0 0',
    padding: 0,
    borderRadius: 6,
  },
  paperExplore: {
    height: '100%',
    margin: 0,
    padding: 0,
    borderRadius: 6,
  },
  tableHead: {
    textTransform: 'uppercase',
    height: 40,
    fontSize: 11,
  },
  tableBody: {
    fontSize: 15,
  },
  updateButton: {
    float: 'right',
    margin: '7px 10px 0 0',
  },
});

const entityStixRelationsTableStixRelationDistributionQuery = graphql`
  query EntityStixRelationsTableStixRelationDistributionQuery(
    $fromId: String
    $toTypes: [String]
    $entityTypes: [String]
    $relationType: String
    $inferred: Boolean
    $startDate: DateTime
    $endDate: DateTime
    $resolveInferences: Boolean
    $resolveRelationType: String
    $resolveRelationRole: String
    $resolveRelationToTypes: [String]
    $resolveViaTypes: [EntityRelation]
    $field: String!
    $operation: StatsOperation!
  ) {
    stixRelationsDistribution(
      fromId: $fromId
      toTypes: $toTypes
      entityTypes: $entityTypes
      relationType: $relationType
      inferred: $inferred
      startDate: $startDate
      endDate: $endDate
      resolveInferences: $resolveInferences
      resolveRelationType: $resolveRelationType
      resolveRelationRole: $resolveRelationRole
      resolveRelationToTypes: $resolveRelationToTypes
      resolveViaTypes: $resolveViaTypes
      field: $field
      operation: $operation
    ) {
      label
      value
    }
  }
`;

class EntityStixRelationsTable extends Component {
  renderContent() {
    const {
      t,
      classes,
      entityId,
      entityType,
      relationType,
      field,
      entityTypes,
      inferred,
      startDate,
      endDate,
      resolveInferences,
      resolveRelationType,
      resolveRelationRole,
      resolveRelationToTypes,
      resolveViaTypes,
    } = this.props;
    const stixRelationsDistributionVariables = {
      fromId: entityId,
      toTypes: entityType ? [entityType] : null,
      entityTypes: entityTypes || null,
      inferred: inferred !== null ? inferred : true,
      startDate: startDate || null,
      endDate: endDate || null,
      resolveInferences,
      resolveRelationType,
      resolveRelationRole,
      resolveRelationToTypes,
      resolveViaTypes,
      relationType,
      field,
      operation: 'count',
    };
    return (
      <QueryRenderer
        query={entityStixRelationsTableStixRelationDistributionQuery}
        variables={stixRelationsDistributionVariables}
        render={({ props }) => {
          if (
            props
            && props.stixRelationsDistribution
            && props.stixRelationsDistribution.length > 0
          ) {
            return (
              <Table className={classes.table}>
                <TableHead>
                  <TableRow className={classes.tableHead}>
                    <TableCell>
                      {t(`entity_${entityType.toLowerCase()}`)}
                    </TableCell>
                    <TableCell align="right">{t('Number')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.stixRelationsDistribution.map(row => (
                    <TableRow key={row.label} hover={true}>
                      <TableCell
                        component="th"
                        scope="row"
                        padding="default"
                        className={classes.tableBody}
                      >
                        {row.label}
                      </TableCell>
                      <TableCell
                        align="right"
                        padding="default"
                        className={classes.tableBody}
                      >
                        {row.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            );
          }
          if (props) {
            return (
              <div style={{ display: 'table', height: '100%', width: '100%' }}>
                <span
                  style={{
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                  }}
                >
                  {t('No entities of this type has been found.')}
                </span>
              </div>
            );
          }
          return (
            <div style={{ display: 'table', height: '100%', width: '100%' }}>
              <span
                style={{
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                }}
              >
                <CircularProgress size={40} thickness={2} />
              </span>
            </div>
          );
        }}
      />
    );
  }

  render() {
    const {
      t,
      classes,
      variant,
      title,
      entityType,
      configuration,
      handleOpenConfig,
    } = this.props;
    if (variant === 'explore') {
      return (
        <Paper classes={{ root: classes.paperExplore }} elevation={2}>
          <Typography
            variant="h4"
            gutterBottom={true}
            style={{ float: 'left', padding: '10px 0 0 10px' }}
          >
            {title || `${t('Distribution:')} ${t(`entity_${entityType}`)}`}
          </Typography>
          <IconButton
            color="secondary"
            aria-label="Update"
            size="small"
            classes={{ root: classes.updateButton }}
            onClick={handleOpenConfig.bind(this, configuration)}
          >
            <SettingsInputComponent fontSize="inherit" />
          </IconButton>
          <div className="clearfix" />
          {this.renderContent()}
        </Paper>
      );
    }
    return (
      <div style={{ height: '100%' }}>
        <Typography variant="h4" gutterBottom={true}>
          {title || `${t('Top 10:')} ${t(`entity_${entityType}`)}`}
        </Typography>
        <Paper classes={{ root: classes.paper }} elevation={2}>
          {this.renderContent()}
        </Paper>
      </div>
    );
  }
}

EntityStixRelationsTable.propTypes = {
  variant: PropTypes.string,
  title: PropTypes.string,
  entityId: PropTypes.string,
  relationType: PropTypes.string,
  entityType: PropTypes.string,
  inferred: PropTypes.bool,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  resolveInferences: PropTypes.bool,
  resolveRelationType: PropTypes.string,
  resolveRelationRole: PropTypes.string,
  resolveRelationToTypes: PropTypes.array,
  resolveViaTypes: PropTypes.array,
  entityTypes: PropTypes.array,
  field: PropTypes.string,
  classes: PropTypes.object,
  t: PropTypes.func,
  fld: PropTypes.func,
  configuration: PropTypes.object,
  handleOpenConfig: PropTypes.func,
};

export default compose(
  inject18n,
  withStyles(styles),
)(EntityStixRelationsTable);
